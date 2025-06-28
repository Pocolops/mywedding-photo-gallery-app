
import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Sample images for demonstration
const sampleImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop', date: '20/9/2025 12:45' },
  { id: 2, url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop', date: '19/9/2025 14:30' },
  { id: 3, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop', date: '18/9/2025 10:15' },
  { id: 4, url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop', date: '17/9/2025 16:20' },
  { id: 5, url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop', date: '16/9/2025 09:45' },
  { id: 6, url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop', date: '15/9/2025 11:30' },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<typeof sampleImages[0] | null>(null);

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 font-serif">
      {/* Header with back button */}
      <div className="flex items-center p-4">
        <Link to="/menu" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="ml-4 text-lg tracking-[0.3em] uppercase text-gray-900 font-normal">
          GALLERY
        </h1>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {sampleImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square bg-black rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.url} 
                alt={`Gallery image ${image.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6">
            <div className="aspect-square bg-black rounded-2xl mb-4 overflow-hidden">
              <img 
                src={selectedImage.url} 
                alt={`Gallery image ${selectedImage.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 text-sm">{selectedImage.date}</span>
              <Button
                onClick={() => handleDownload(selectedImage.url, `image-${selectedImage.id}`)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-xs tracking-wider uppercase"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <Button
              onClick={() => setSelectedImage(null)}
              variant="outline"
              className="w-full rounded-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
