import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';
import { Loader } from 'lucide-react';

interface FirebaseImageProps {
  storagePath: string;
  alt?: string;
  className?: string;
  fallbackImage?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
}

const FirebaseImage: React.FC<FirebaseImageProps> = ({
  storagePath,
  alt = 'Image',
  className = '',
  fallbackImage = '/placeholder.jpg',
  onLoad,
  onError,
  width,
  height,
  objectFit = 'cover',
  onClick
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchImage = async () => {
      // Check if storagePath is valid
      if (!storagePath || typeof storagePath !== 'string' || storagePath.trim() === '') {
        console.error('Invalid or empty storage path provided');
        setError(new Error('Invalid or empty storage path provided'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const imageRef = ref(storage, storagePath);
        const url = await getDownloadURL(imageRef);
        console.log(`Image loaded from Firebase: ${storagePath}`);
        setImageUrl(url);
        if (onLoad) onLoad();
      } catch (err) {
        console.error('Error loading image from Firebase:', err);
        setError(err);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [storagePath, onLoad, onError]);

  const imageStyle = {
    width: width,
    height: height,
    objectFit: objectFit
  };

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <Loader className="w-6 h-6 animate-spin text-plum" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <img 
          src={fallbackImage} 
          alt={`${alt} (failed to load)`} 
          className={className}
          style={imageStyle}
          onClick={onClick}
        />
        <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Error
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      style={imageStyle}
      onClick={onClick}
      onLoad={() => onLoad && onLoad()}
    />
  );
};

export default FirebaseImage;
