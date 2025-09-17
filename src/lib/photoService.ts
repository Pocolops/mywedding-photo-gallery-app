import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  UploadTaskSnapshot 
} from 'firebase/storage';
import { db, storage } from './firebase';

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  size: number;
  uploadedAt: Date;
  photographer: string;
  caption?: string;
}

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

// Photos collection reference
const photosCollection = collection(db, 'photos');

// Lightweight thumbnail generation to keep gallery fast (keeps original file untouched)
const createThumbnailBlob = async (
  file: File,
  maxSide: number = 800,
  mimeType: string = 'image/jpeg',
  quality: number = 0.82
): Promise<Blob | null> => {
  // Only attempt for images
  if (!file.type.startsWith('image/')) return null;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      let tw = w;
      let th = h;
      if (w > h && w > maxSide) {
        tw = maxSide; th = Math.round((h / w) * maxSide);
      } else if (h >= w && h > maxSide) {
        th = maxSide; tw = Math.round((w / h) * maxSide);
      }
      const canvas = document.createElement('canvas');
      canvas.width = tw; canvas.height = th;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, tw, th);
      canvas.toBlob((b) => resolve(b), mimeType, quality);
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
};

// Upload a photo with progress tracking
export const uploadPhoto = async (
  file: File, 
  photographer: string, 
  caption: string = '',
  onProgress?: (progress: UploadProgress) => void
): Promise<Photo> => {
  try {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name}`;
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create storage references
    const originalRef = ref(storage, `photos/original/${safeName}`);
    const thumbnailRef = ref(storage, `photos/thumbnails/${safeName}`);
    
    // Upload original image (keep original quality for social sharing)
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadTask = uploadBytesResumable(originalRef, file, {
      contentType: file.type,
      contentDisposition: `attachment; filename="${sanitizedOriginalName}"`,
      customMetadata: {
        photographer,
        caption,
        originalName: file.name
      }
    });

    // Return promise that resolves when upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          // Progress tracking
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress({
              progress,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes
            });
          }
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          try {
            // Create and upload thumbnail in parallel (fallback to original on failure)
            let thumbnailURL = '';
            try {
              const thumbBlob = await createThumbnailBlob(file, 800, 'image/jpeg', 0.82);
              if (thumbBlob) {
                const thumbTask = uploadBytesResumable(thumbnailRef, thumbBlob, {
                  contentType: 'image/jpeg',
                  customMetadata: { photographer, caption, originalName: file.name }
                });
                await new Promise<void>((res, rej) => {
                  thumbTask.on('state_changed', undefined, rej, () => res());
                });
                thumbnailURL = await getDownloadURL(thumbTask.snapshot.ref);
              }
            } catch {}

            // Original URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (!thumbnailURL) thumbnailURL = downloadURL;
            
            // Save metadata to Firestore
            const photoDoc = await addDoc(photosCollection, {
              url: downloadURL,
              thumbnailUrl: thumbnailURL,
              fileName: file.name,
              size: file.size,
              uploadedAt: Timestamp.now(),
              photographer,
              caption: caption || '',
              contentType: file.type
            });

            const photo: Photo = {
              id: photoDoc.id,
              url: downloadURL,
              thumbnailUrl: thumbnailURL,
              fileName: file.name,
              size: file.size,
              uploadedAt: new Date(),
              photographer,
              caption
            };

            resolve(photo);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error starting upload:', error);
    throw error;
  }
};

// Get photos with pagination
export const getPhotos = async (pageSize: number = 12, lastDoc?: QueryDocumentSnapshot<DocumentData>) => {
  try {
    let q = query(
      photosCollection, 
      orderBy('uploadedAt', 'desc'), 
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        photosCollection, 
        orderBy('uploadedAt', 'desc'), 
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const photos: Photo[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      photos.push({
        id: doc.id,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        fileName: data.fileName,
        size: data.size,
        uploadedAt: data.uploadedAt.toDate(),
        photographer: data.photographer,
        caption: data.caption || ''
      });
    });

    return {
      photos,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

// Subscribe to real-time photo updates
export const subscribeToPhotos = (
  callback: (photos: Photo[]) => void,
  pageSize: number = 50
) => {
  const q = query(
    photosCollection, 
    orderBy('uploadedAt', 'desc'), 
    limit(pageSize)
  );

  return onSnapshot(q, (snapshot) => {
    const photos: Photo[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      photos.push({
        id: doc.id,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        fileName: data.fileName,
        size: data.size,
        uploadedAt: data.uploadedAt.toDate(),
        photographer: data.photographer,
        caption: data.caption || ''
      });
    });
    callback(photos);
  });
};

// Search photos by photographer
export const searchPhotosByPhotographer = async (photographer: string) => {
  try {
    const q = query(
      photosCollection,
      orderBy('uploadedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const photos: Photo[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.photographer.toLowerCase().includes(photographer.toLowerCase())) {
        photos.push({
          id: doc.id,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          fileName: data.fileName,
          size: data.size,
          uploadedAt: data.uploadedAt.toDate(),
          photographer: data.photographer,
          caption: data.caption || ''
        });
      }
    });

    return photos;
  } catch (error) {
    console.error('Error searching photos:', error);
    throw error;
  }
};

// Get photo statistics
export const getPhotoStats = async () => {
  try {
    const snapshot = await getDocs(photosCollection);
    const totalPhotos = snapshot.size;
    let totalSize = 0;
    const photographers = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalSize += data.size || 0;
      photographers.add(data.photographer);
    });

    return {
      totalPhotos,
      totalSize,
      totalPhotographers: photographers.size,
      photographers: Array.from(photographers)
    };
  } catch (error) {
    console.error('Error getting photo stats:', error);
    throw error;
  }
}; 