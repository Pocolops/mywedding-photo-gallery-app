
import { Button } from '@/components/ui/button';
import { Camera, GalleryHorizontal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-200 font-serif">
      {/* Header with back button */}
      <div className="flex items-center p-4">
        <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="ml-4 text-lg tracking-[0.3em] uppercase text-gray-900 font-normal">
          DANIAL & SYAHIRAH
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-6">
        {/* Upload Photos Button */}
        <Button 
          asChild
          className="w-80 h-20 bg-gray-900 hover:bg-gray-800 text-white rounded-3xl text-sm tracking-[0.2em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
        >
          <Link to="/upload" className="flex items-center justify-center space-x-3">
            <Camera className="h-6 w-6" />
            <span>Upload Your Photos</span>
          </Link>
        </Button>

        {/* View Gallery Button */}
        <Button 
          asChild
          className="w-80 h-20 bg-gray-900 hover:bg-gray-800 text-white rounded-3xl text-sm tracking-[0.2em] uppercase font-normal transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
        >
          <Link to="/gallery" className="flex items-center justify-center space-x-3">
            <GalleryHorizontal className="h-6 w-6" />
            <span>View Gallery</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Menu;
