import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, ImageIcon, XCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface UploadReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onImageUploaded: (imageUrl: string) => void;
}

const UploadReferenceModal: React.FC<UploadReferenceModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  onImageUploaded
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setUploadedImage(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload with preview (in a real app, you'd upload to server here)
    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate network delay
      setTimeout(() => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setIsUploading(false);
        }
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setUploadedImage(null);
  };

  const handleContinue = () => {
    if (uploadedImage) {
      onImageUploaded(uploadedImage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-gray-800">
            Upload Reference Image for {serviceName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!uploadedImage ? (
            <div 
              className={`
                border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
                ${dragActive ? 'border-plum bg-plum/5' : 'border-gray-300'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-plum" />
              </div>
              
              <p className="text-center mb-2">
                <span className="font-medium">Drag and drop your image here</span>
              </p>
              <p className="text-sm text-gray-500 text-center mb-4">
                or click to browse files from your device
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <Button 
                variant="outline"
                onClick={triggerFileSelect}
                className="mb-4"
              >
                Browse Files
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                Supported formats: JPG, PNG, HEIC<br />
                Maximum file size: 5MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={uploadedImage}
                alt="Uploaded Reference"
                className="w-full max-h-80 object-contain rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1"
                onClick={handleClearImage}
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={triggerFileSelect}
            >
              <ImageIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Gallery</span>
            </button>
            
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => {
                toast({
                  title: "Camera access",
                  description: "Camera functionality would be implemented here in a production app",
                });
              }}
            >
              <Camera className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Take a Photo</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleContinue}
            className="flex-1 bg-plum hover:bg-plum/90"
            disabled={!uploadedImage || isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              'Continue to Customization'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadReferenceModal;
