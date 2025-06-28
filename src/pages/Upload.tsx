
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload logic here
      console.log('File selected:', e.target.files[0]);
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
          UPLOAD
        </h1>
      </div>

      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div 
          className={`w-full max-w-lg h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 transition-colors ${
            dragActive 
              ? 'border-gray-900 bg-gray-300' 
              : 'border-gray-500 bg-gray-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
            <UploadIcon className="h-8 w-8 text-white" />
          </div>
          
          <div className="text-center">
            <p className="text-gray-900 font-medium mb-2">Browse Files</p>
            <p className="text-gray-600 text-sm">Drag and drop files here or click to browse</p>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
