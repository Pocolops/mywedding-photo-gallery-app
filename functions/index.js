const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const archiver = require('archiver');

admin.initializeApp();
const storage = new Storage();

// Admin-only delete (checks email from Firebase Auth token and env config)
exports.adminDelete = functions.https.onRequest(async (req, res) => {
  try {
    const idToken = (req.headers.authorization || '').replace('Bearer ', '');
    if (!idToken) return res.status(401).send('Missing token');
    const decoded = await admin.auth().verifyIdToken(idToken);
    const adminEmail = (process.env.ADMIN_EMAIL || (functions.config().admin && functions.config().admin.email) || '').toLowerCase();
    const userEmail = (decoded.email || '').toLowerCase();
    if (!adminEmail) return res.status(500).send('Admin email not configured');
    if (userEmail !== adminEmail) return res.status(403).send('Forbidden: not admin');

    const { id, path, url } = req.method === 'POST' ? req.body : req.query;
    if (!id || (!path && !url)) return res.status(400).send('Missing id and object reference');

    // Derive object path from URL if needed
    let objectPath = path;
    if (!objectPath && url) {
      const match = String(url).match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        objectPath = decodeURIComponent(match[1]);
      }
    }
    if (!objectPath) return res.status(400).send('Unable to determine object path');

    // Delete Storage file
    const bucket = admin.storage().bucket();
    await bucket.file(objectPath).delete({ ignoreNotFound: true });
    // Try deleting corresponding thumbnail if path suggests original/
    if (objectPath.includes('/original/')) {
      const thumbPath = objectPath.replace('/original/', '/thumbnails/');
      await bucket.file(thumbPath).delete({ ignoreNotFound: true });
    }
    // Delete Firestore doc
    const db = admin.firestore();
    await db.collection('photos').doc(id).delete();
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Single file download with Content-Disposition attachment
exports.downloadFile = functions.https.onRequest(async (req, res) => {
  try {
    const { path, filename } = req.query;
    if (!path) {
      res.status(400).send('Missing path');
      return;
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file(path);
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).send('File not found');
      return;
    }

    const safeName = (filename || path.split('/').pop() || 'photo.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);

    file.createReadStream().on('error', (err) => {
      console.error('Stream error', err);
      res.status(500).end();
    }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Zip multiple files and stream
exports.downloadZip = functions.https.onRequest(async (req, res) => {
  try {
    const { paths, urls, name } = req.method === 'POST' ? req.body : req.query;
    let fileRefs = [];
    // Accept either Storage paths or public download URLs
    if (paths) {
      if (typeof paths === 'string') {
        try { fileRefs = JSON.parse(paths); } catch { fileRefs = []; }
      } else if (Array.isArray(paths)) {
        fileRefs = paths;
      }
    } else if (urls) {
      let urlList = [];
      if (typeof urls === 'string') {
        try { urlList = JSON.parse(urls); } catch { urlList = []; }
      } else if (Array.isArray(urls)) {
        urlList = urls;
      }
      fileRefs = urlList.map((u) => {
        const m = String(u).match(/\/o\/([^?]+)/);
        return m && m[1] ? decodeURIComponent(m[1]) : null;
      }).filter(Boolean);
    }
    if (!fileRefs || fileRefs.length === 0) {
      res.status(400).send('Missing file references');
      return;
    }

    const zipName = (name || 'wedding-photos.zip').replace(/[^a-zA-Z0-9.-]/g, '_');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archive error', err);
      res.status(500).end();
    });
    archive.pipe(res);

    const bucket = admin.storage().bucket();
    for (const p of fileRefs) {
      const f = bucket.file(p);
      const [exists] = await f.exists();
      if (!exists) continue;
      const baseName = p.split('/').pop() || 'photo.jpg';
      archive.append(f.createReadStream(), { name: baseName });
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


