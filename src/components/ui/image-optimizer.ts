/**
 * Image optimization utilities
 */

/**
 * Generate a thumbnail URL by adding query parameters for responsive images
 * Works with various CDN/cloud storage providers like Firebase Storage, Cloudinary, etc.
 * 
 * @param originalUrl The original image URL
 * @param width Desired width for the thumbnail
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (originalUrl: string, width: number = 400, quality: number = 80): string => {
  if (!originalUrl) return '';
  
  // Handle different image providers
  try {
    const url = new URL(originalUrl);
    
    // Handle Firebase Storage
    if (url.hostname.includes('firebasestorage.googleapis.com')) {
      // For Firebase Storage URLs, we can add _<width>x<width> before the file extension
      // This works if you've configured Firebase Storage to use an image optimization service like imgix
      // Otherwise, we leave it as is since Firebase doesn't natively support resizing
      return originalUrl;
    }
    
    // Handle Cloudinary
    if (url.hostname.includes('cloudinary.com')) {
      // Replace 'upload/' with 'upload/w_<width>,q_<quality>/' for responsive images
      return originalUrl.replace('/upload/', `/upload/w_${width},q_${quality}/`);
    }
    
    // Handle generic CDNs or services that support query parameters
    if (originalUrl.indexOf('?') === -1) {
      return `${originalUrl}?width=${width}&quality=${quality}`;
    } else {
      return `${originalUrl}&width=${width}&quality=${quality}`;
    }
  } catch (e) {
    // If we can't parse the URL, return the original
    return originalUrl;
  }
};

/**
 * Preload an image to ensure it's in browser cache before needed
 * Useful for critical images that will be shown soon
 * 
 * @param src The image URL to preload
 */
export const preloadImage = (src: string): void => {
  if (!src) return;
  
  const img = new Image();
  img.src = src;
};

/**
 * Generate a set of srcSet values for responsive images
 * 
 * @param src The base image URL
 * @param sizes Array of widths to generate sources for
 * @returns A string formatted as a valid srcSet attribute
 */
export const generateSrcSet = (src: string, sizes: number[] = [320, 640, 960, 1280]): string => {
  if (!src) return '';
  
  return sizes
    .map(size => `${getOptimizedImageUrl(src, size)} ${size}w`)
    .join(', ');
};

/**
 * Generate a placeholder color from an image URL
 * Using a simple hash function to create a consistent color
 * 
 * @param url Image URL
 * @returns CSS color string
 */
export const generatePlaceholderColor = (url: string): string => {
  if (!url) return '#f3f4f6'; // Default light gray
  
  // Simple hash function to generate a color from a string
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = url.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to a pastel-like hex color
  const r = (hash & 0xFF) % 200 + 55;
  const g = ((hash >> 8) & 0xFF) % 200 + 55;
  const b = ((hash >> 16) & 0xFF) % 200 + 55;
  
  return `rgb(${r}, ${g}, ${b})`;
};
