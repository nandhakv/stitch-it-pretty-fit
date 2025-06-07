import React, { useState, useEffect } from 'react';
import { getOptimizedImageUrl, generateSrcSet, generatePlaceholderColor } from './image-optimizer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  priority?: boolean;
  responsive?: boolean;
  quality?: number;
  widths?: number[];
}

/**
 * OptimizedImage component that handles:
 * - Lazy loading with IntersectionObserver
 * - Low quality image placeholders (blur-up effect)
 * - Error fallbacks
 * - Responsive loading
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualitySrc,
  className = '',
  aspectRatio = 'aspect-auto',
  objectFit = 'cover',
  priority = false,
  responsive = true,
  quality = 80,
  widths = [320, 640, 960, 1280],
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}) => {
  // Generate background color based on src for a nicer placeholder
  const placeholderColor = generatePlaceholderColor(src);
  const placeholderSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${placeholderColor}"/></svg>`)}`;  
  
  // Create optimized image URL
  const optimizedSrc = responsive ? getOptimizedImageUrl(src, 800, quality) : src;
  const srcSet = responsive ? generateSrcSet(src, widths) : undefined;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? optimizedSrc : (lowQualitySrc || placeholderSvg));
  const [currentSrcSet, setCurrentSrcSet] = useState(priority ? srcSet : undefined);
  
  const imageRef = React.useRef<HTMLImageElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Handle image load events
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  // Handle image errors
  const handleError = () => {
    setError(true);
    setCurrentSrc(fallbackSrc);
  };

  useEffect(() => {
    let observer: IntersectionObserver;
    const currentImageRef = imageRef.current;

    // Skip lazy loading if priority is true
    if (priority) {
      return;
    }

    // Create an intersection observer to lazy load the image
    if (currentImageRef && !isLoaded && !error) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When the image is in view, load the high quality image
            setCurrentSrc(optimizedSrc);
            setCurrentSrcSet(srcSet);
            
            // Stop observing once we've started loading
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px', // Start loading when image is 200px from viewport (increased for better perception)
        threshold: 0.01 // Trigger when 1% of the image is visible
      });

      observer.observe(currentImageRef);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current && currentImageRef) {
        observerRef.current.unobserve(currentImageRef);
      }
    };
  }, [optimizedSrc, srcSet, isLoaded, error, priority]);

  // Classes for the blur-up effect
  const blurClass = isLoaded ? '' : 'filter blur-sm scale-105';
  const transitionClass = 'transition-all duration-500 ease-in-out';
  
  // Object fit class based on prop
  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  return (
    <div className={`overflow-hidden ${aspectRatio}`} style={{ backgroundColor: placeholderColor }}>
      <img
        ref={imageRef}
        src={currentSrc}
        srcSet={currentSrcSet}
        sizes={responsive ? sizes : undefined}
        alt={alt}
        className={`w-full h-full ${objectFitClass} ${blurClass} ${transitionClass} ${className}`}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleImageLoaded}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
