import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getPhotos, Photo } from '@/lib/photoService';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, LogOut, Check } from 'lucide-react';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      const res = await getPhotos(50);
      setPhotos(res.photos);
      setLoading(false);
    };
    load();
  }, [user]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => { await signOut(auth); };

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return;
    try {
      setDeleting(photo.id);
      // Get ID token for secured function
      const current = auth.currentUser;
      const token = current ? await current.getIdToken(true) : '';
      if (!token) {
        alert('Please login again to continue.');
        return;
      }
      // Prefer URL (function can derive storage path safely)
      const params = new URLSearchParams({ id: photo.id, url: photo.url });
      const resp = await fetch(`/api/adminDelete?${params.toString()}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error('Delete failed');
      setPhotos((prev) => prev.filter(p => p.id !== photo.id));
    } finally {
      setDeleting(null);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode((v) => !v);
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(photos.map(p => p.id)));
  const clearSelection = () => setSelected(new Set());

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} photo(s)?`)) return;
    const current = auth.currentUser;
    const token = current ? await current.getIdToken(true) : '';
    if (!token) { alert('Please login again.'); return; }
    const targets = photos.filter(p => selected.has(p.id));
    for (const p of targets) {
      try {
        const params = new URLSearchParams({ id: p.id, url: p.url });
        const resp = await fetch(`/api/adminDelete?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          setPhotos(prev => prev.filter(x => x.id !== p.id));
          setSelected(prev => { const n = new Set(prev); n.delete(p.id); return n; });
        }
      } catch {}
    }
    setSelectionMode(false);
  };

  if (!user) {
    return (
      <div className="h-[100svh] flex items-center justify-center bg-gray-200">
        <form onSubmit={login} className="bg-white p-6 rounded-2xl shadow w-80 space-y-3">
          <h1 className="text-lg font-medium">Admin Login</h1>
          <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <Button className="w-full">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-[100svh] flex flex-col bg-gray-200">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg tracking-widest">Admin</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleSelectionMode}>
            {selectionMode ? 'Done' : 'Select'}
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2"/> Logout
          </Button>
        </div>
      </div>
      {selectionMode && (
        <div className="px-4 pb-2 flex items-center gap-3 text-sm">
          <span>{selected.size} selected</span>
          <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
          <Button variant="ghost" size="sm" onClick={clearSelection}>Clear</Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={selected.size===0}>
            Delete ({selected.size})
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin mr-2"/> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-300 cursor-pointer"
                onClick={() => selectionMode ? toggleSelect(photo.id) : undefined}
              >
                <img src={photo.thumbnailUrl || photo.url} alt={photo.fileName} className="w-full h-full object-cover" />
                {selectionMode ? (
                  <div className="absolute inset-0 bg-black/20 flex items-start justify-start p-2">
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center ${selected.has(photo.id) ? 'bg-blue-600 border-blue-600' : 'border-white bg-white/30'}`}>
                      {selected.has(photo.id) && <Check className="h-4 w-4 text-white"/>}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleDelete(photo)}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    disabled={deleting === photo.id}
                  >
                    {deleting === photo.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;


