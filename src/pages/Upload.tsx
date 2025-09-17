import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload as UploadIcon, CheckCircle, X, Loader2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { uploadPhoto, UploadProgress } from '@/lib/photoService';
import { useToast } from '@/hooks/use-toast';

type SelectedFile = {
  id: string;
  file: File;
  preview: string;
};

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  progress: number;
};

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [photographerName, setPhotographerName] = useState('');
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const newFiles: SelectedFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        
        newFiles.push({
          id,
          file,
          preview
        });
      }
    });

    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setShowConfirmation(true);
    }
  };

  const realUpload = async (fileId: string, file: File, photographer: string) => {
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, uploading: true, progress: 0 }
          : f
      )
    );

    try {
      await uploadPhoto(
        file,
        photographer,
        '',
        (progress: UploadProgress) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, progress: progress.progress }
                : f
            )
          );
        }
      );

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, uploading: false, uploaded: true, progress: 100 }
            : f
        )
      );

      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded to the gallery.`,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, uploading: false, uploaded: false, progress: 0 }
            : f
        )
      );

      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input
    e.target.value = '';
  };

  const removeSelectedFile = (fileId: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const confirmUpload = () => {
    if (!photographerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before uploading.",
        variant: "destructive",
      });
      return;
    }

    // Convert selected files to uploaded files
    const filesToUpload: UploadedFile[] = selectedFiles.map(file => ({
      ...file,
      uploading: false,
      uploaded: false,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...filesToUpload]);
    
    // Start real upload for each file
    filesToUpload.forEach((file, index) => {
      setTimeout(() => realUpload(file.id, file.file, photographerName), 500 * (index + 1));
    });

    // Clear selected files and hide confirmation
    setSelectedFiles([]);
    setShowConfirmation(false);
  };

  const cancelUpload = () => {
    // Clean up selected files
    selectedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    setShowConfirmation(false);
  };

  const uploadedCount = uploadedFiles.filter(f => f.uploaded).length;
  const uploadingCount = uploadedFiles.filter(f => f.uploading).length;

  return (
    <div className="h-[100svh] flex flex-col bg-gray-200 font-serif overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center p-4 bg-gray-200 sticky top-0 z-40 backdrop-blur-sm">
        <Link to="/menu" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="ml-4 text-lg tracking-[0.3em] uppercase text-gray-900 font-normal">
          UPLOAD
        </h1>
        {uploadedFiles.length > 0 && (
          <div className="ml-auto text-sm text-gray-600">
            {uploadedCount} uploaded, {uploadingCount} uploading
          </div>
        )}
      </div>

      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden flex flex-col justify-center">
        {/* Upload Area */}
        <div className="flex items-center justify-center">
          <div 
            className={`relative w-full max-w-lg h-56 md:h-72 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-3 md:space-y-4 transition-all duration-300 ${
              dragActive 
                ? 'border-gray-900 bg-gray-300 scale-105' 
                : 'border-gray-500 bg-gray-100 hover:border-gray-700 hover:bg-gray-150'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center transition-transform duration-300 ${
              dragActive ? 'scale-110' : ''
            }`}>
              <UploadIcon className="h-8 w-8 text-white" />
            </div>
            
            <div className="text-center">
              <p className="text-gray-900 font-medium mb-2">
                {dragActive ? 'Drop your photos here!' : 'Browse Files'}
              </p>
              <p className="text-gray-600 text-sm">
                Drag and drop files here or click to browse
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Supports JPG, PNG, GIF up to 10MB
              </p>
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

        {/* Confirmation Modal */}
        {showConfirmation && selectedFiles.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-900 tracking-wider">
                    Confirm Upload ({selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''})
                  </h2>
                  <Button
                    onClick={cancelUpload}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-gray-600 mb-4">
                  Please review your photos before uploading. You can remove any photos you don't want to share.
                </p>

                {/* Photographer Name Input */}
                <div className="mb-6">
                  <label htmlFor="photographer" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="photographer"
                    type="text"
                    value={photographerName}
                    onChange={(e) => setPhotographerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Selected Photos Grid */}
                <div className="max-h-96 overflow-y-auto mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative aspect-square bg-gray-300 rounded-2xl overflow-hidden group"
                      >
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Remove button */}
                        <Button
                          onClick={() => removeSelectedFile(file.id)}
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 opacity-90 hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        {/* File info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs truncate">{file.file.name}</p>
                          <p className="text-xs opacity-75">
                            {(file.file.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={cancelUpload}
                    variant="outline"
                    className="flex-1 rounded-full text-sm tracking-wider uppercase"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={confirmUpload}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm tracking-wider uppercase"
                    disabled={selectedFiles.length === 0}
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4 tracking-wider">
              Your Photos ({uploadedFiles.length})
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="relative aspect-square bg-gray-300 rounded-2xl overflow-hidden group"
                >
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload overlay */}
                  {uploadedFile.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                      <div className="w-3/4 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <p className="text-white text-xs mt-2">
                        {Math.round(uploadedFile.progress)}%
                      </p>
                    </div>
                  )}
                  
                  {/* Success overlay */}
                  {uploadedFile.uploaded && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <Button
                    onClick={() => removeUploadedFile(uploadedFile.id)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs opacity-75">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Summary */}
            {uploadedCount > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 font-medium">
                    Successfully uploaded {uploadedCount} photo{uploadedCount !== 1 ? 's' : ''}!
                  </p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Your memories have been added to the wedding gallery.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full text-sm tracking-wider uppercase"
              >
                <Link to="/gallery">
                  View Gallery
                </Link>
              </Button>
              
              <Button
                onClick={() => setUploadedFiles([])}
                variant="outline"
                className="px-6 rounded-full text-sm tracking-wider uppercase"
                disabled={uploadedFiles.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
