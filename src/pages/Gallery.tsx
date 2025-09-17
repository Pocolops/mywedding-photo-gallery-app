import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Download, X, ChevronLeft, ChevronRight, Loader2, Check, Square, CheckSquare, DownloadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPhotos, subscribeToPhotos, Photo } from '@/lib/photoService';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  
  // Bulk selection states
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Memoized mobile detection for performance optimization
  const isMobileDevice = useMemo(() => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), 
    []
  );

  // Initial load with real-time subscription
  useEffect(() => {
    const loadInitialPhotos = async () => {
      setLoading(true);
      try {
        const result = await getPhotos(12);
        setPhotos(result.photos);
        setLastDoc(result.lastDoc || null);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPhotos();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPhotos((updatedPhotos) => {
      setPhotos(updatedPhotos);
    });

    return () => unsubscribe();
  }, []);

  // Load more photos (infinite scroll)
  const loadMorePhotos = useCallback(async () => {
    if (loadingMore || !hasMore || !lastDoc) return;
    
    setLoadingMore(true);
    try {
      const result = await getPhotos(12, lastDoc);
      setPhotos(prev => [...prev, ...result.photos]);
      setLastDoc(result.lastDoc || null);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, loadingMore, hasMore]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMorePhotos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePhotos]);

  // Handle image loading states
  const handleImageLoad = (photoId: string) => {
    setImageLoading(prev => ({ ...prev, [photoId]: false }));
  };

  const handleImageLoadStart = (photoId: string) => {
    setImageLoading(prev => ({ ...prev, [photoId]: true }));
  };

  // Lightbox navigation
  const openLightbox = (photo: Photo, index: number) => {
    if (selectionMode) return; // Don't open lightbox in selection mode
    setSelectedImage(photo);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(photos[newIndex]);
  };

  const goToNext = () => {
    const newIndex = selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedImage(photos[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, selectedIndex, photos]);

  // Bulk selection functions
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPhotos(new Set());
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const selectAllPhotos = () => {
    const allPhotoIds = new Set(photos.map(photo => photo.id));
    setSelectedPhotos(allPhotoIds);
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  // Download selected files as a single ZIP via Cloud Function
  const downloadAsZip = (fileUrls: string[], zipName: string) => {
    const fn = 'https://us-central1-weddinggallery-5a4fe.cloudfunctions.net/downloadZip';
    const qs = new URLSearchParams({ urls: JSON.stringify(fileUrls), name: zipName });
    const href = `${fn}?${qs.toString()}`;
    const a = document.createElement('a');
    a.href = href;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Utility function to create optimized download URL for Firebase Storage
  const createDownloadUrl = (firebaseUrl: string, fileName?: string): string => {
    try {
      const url = new URL(firebaseUrl);
      // Force direct file download
      url.searchParams.set('alt', 'media');
      if (fileName) {
        url.searchParams.set(
          'response-content-disposition',
          `attachment; filename="${fileName}"`
        );
      } else {
        url.searchParams.set('response-content-disposition', 'attachment');
      }
      return url.toString();
    } catch {
      // Fallback for invalid URLs
      const base = firebaseUrl + (firebaseUrl.includes('?') ? '&' : '?') + 'alt=media';
      return fileName
        ? `${base}&response-content-disposition=${encodeURIComponent(
            `attachment; filename="${fileName}"`
          )}`
        : `${base}&response-content-disposition=attachment`;
    }
  };


  // iOS-optimized download function for iPhone compatibility
  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const cleanFileName = imageName.replace(/[^a-zA-Z0-9.-]/g, '_') || 'wedding-photo.jpg';
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // iOS: Prefer Share Sheet (Photos) with clear fallback messaging
        toast({ title: 'Preparing your photo...' });
        try {
          const urlForFetch = createDownloadUrl(imageUrl, cleanFileName);
          const resp = await fetch(urlForFetch, { method: 'GET' });
          const blob = await resp.blob();
          const file = new File([blob], cleanFileName, { type: blob.type || 'image/jpeg' });
          const navAny = navigator as any;
          if (navAny?.canShare && navAny.canShare({ files: [file] })) {
            await navAny.share({ files: [file], title: 'Save wedding photo' });
            toast({ title: 'Share Sheet opened', description: "Tap 'Save Image' to save to Photos" });
            return;
          }
        } catch {}

        // Fallback: open in new tab with guidance
        const newTab = window.open(imageUrl, '_blank');
        toast({ title: 'Opened in new tab', description: "Long press → 'Save to Photos'" });
        setTimeout(() => {
          if (newTab && !newTab.closed) {
            toast({ title: 'Tip', description: 'You can also tap the Share icon → Save Image' });
          }
        }, 1500);

      } else {
        // Android and desktop: Direct download (no new tab)
        const downloadUrl = createDownloadUrl(imageUrl, cleanFileName);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = cleanFileName;
        downloadLink.style.display = 'none';
        // No target attribute -> stay in same tab and trigger download manager
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast({
          title: "📥 Download started",
          description: "Photo saved to Downloads",
          duration: 2000,
        });
      }
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "❌ Download failed",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const showHelpMessage = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      toast({
        title: '📱 iPhone Download Guide',
        description: "• Single photo: Tap download → Share Sheet → 'Save Image'\n• If no Share Sheet: We open a new tab → long press → 'Save to Photos'\n• Multiple photos: We deliver a ZIP (open in Files → Select All → Save X Images)",
        duration: 9000,
      });
    } else if (isMobileDevice) {
      toast({
        title: '📱 Android Download Guide', 
        description: "• Single photo: Tap download → saves to Downloads\n• Multiple photos: One ZIP download",
        duration: 7000,
      });
    } else {
      toast({
        title: '💻 Desktop Download Guide',
        description: "• Single photo: Click download → saves to Downloads\n• Multiple photos: One ZIP download",
        duration: 7000,
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 font-serif overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-200 sticky top-0 z-40 backdrop-blur-sm border-b border-gray-300">
        <div className="flex items-center justify-between gap-3">
          <Link to="/menu" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base md:text-lg tracking-[0.3em] uppercase text-gray-900 font-normal">GALLERY</h1>
          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              <span className="hidden sm:block text-sm text-gray-600">
                {photos.length} photo{photos.length !== 1 ? 's' : ''}
              </span>
            )}
            <Button onClick={showHelpMessage} size="sm" variant="outline" className="text-xs">💡 Help</Button>
            {photos.length > 0 && (
              <Button onClick={toggleSelectionMode} variant={selectionMode ? 'default' : 'outline'} size="sm" className="text-xs tracking-wider uppercase">
                {selectionMode ? (<><X className="h-3 w-3 mr-1"/>Cancel</>) : (<><CheckSquare className="h-3 w-3 mr-1"/>Select</>)}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectionMode && (
        <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {selectedPhotos.size} selected
            </span>
            
            <Button
              onClick={selectAllPhotos}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700 text-xs"
            >
              Select All
            </Button>
            
            <Button
              onClick={clearSelection}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700 text-xs"
            >
              Clear
            </Button>
          </div>

          {selectedPhotos.size > 0 && (
            <Button
              onClick={() => {
                const selectedPhotoObjects = photos.filter(photo => selectedPhotos.has(photo.id));
                const urls = selectedPhotoObjects.map(p => p.url);
                toast({ title: 'Preparing ZIP...' });
                downloadAsZip(urls, 'wedding-photos.zip');
                setTimeout(() => {
                  setSelectedPhotos(new Set());
                  setSelectionMode(false);
                }, 800);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-xs font-medium"
            >
              <DownloadCloud className="h-3 w-3 mr-1" />
              Download ({selectedPhotos.size})
            </Button>
          )}
          
          <Button
            onClick={showHelpMessage}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            💡 Help
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
            <p className="text-gray-600 text-center">Loading gallery...</p>
          </div>
        ) : photos.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <Square className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Be the first to share your wedding memories!
            </p>
            <Link to="/upload">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8">
                Upload Photos
              </Button>
            </Link>
          </div>
        ) : (
          // Photos grid
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full max-w-full">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square bg-gray-300 rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => selectionMode ? togglePhotoSelection(photo.id) : openLightbox(photo, index)}
                >
                  {/* Selection overlay */}
                  {selectionMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedPhotos.has(photo.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-white bg-white bg-opacity-20'
                      }`}>
                        {selectedPhotos.has(photo.id) && (
                          <Check className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image loading state */}
                  {imageLoading[photo.id] && (
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  )}

                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={`Photo by ${photo.photographer}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onLoadStart={() => handleImageLoadStart(photo.id)}
                    onLoad={() => handleImageLoad(photo.id)}
                  />
                  
                  {/* Photo info overlay */}
                  {!selectionMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <p className="text-white text-sm font-medium">{photo.photographer}</p>
                        <p className="text-white text-xs opacity-90">{formatDate(photo.uploadedAt)}</p>
                      </div>
                      
                      {/* Download button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo.url, `${photo.photographer}_${photo.fileName}`);
                        }}
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load more indicator */}
            {loadingMore && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more photos...</span>
                </div>
              </div>
            )}

            {/* End of photos indicator */}
            {!hasMore && photos.length > 12 && (
              <div className="text-center mt-8 text-gray-500">
                <p>You've seen all the photos! 📸</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={`Photo by ${selectedImage.photographer}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="bg-black bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedImage.photographer}</p>
                    <p className="text-sm opacity-90">{formatDate(selectedImage.uploadedAt)}</p>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(selectedImage.url, `${selectedImage.photographer}_${selectedImage.fileName}`)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
