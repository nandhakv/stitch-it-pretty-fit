import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
  maxRetries?: number;
}

// Global cache to track failed image URLs
const failedImageCache = new Set<string>();

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  maxRetries = 0,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    // Immediately use fallback if this URL has previously failed
    failedImageCache.has(src as string) ? fallbackSrc : src
  );
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // Reset when src changes
    if (!failedImageCache.has(src as string)) {
      setImgSrc(src);
      setRetries(0);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (retries < maxRetries) {
      // Try one more time
      setRetries(retries + 1);
    } else {
      // Add to global cache of failed URLs
      failedImageCache.add(src as string);
      // Use fallback
      setImgSrc(fallbackSrc);
    }
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;
