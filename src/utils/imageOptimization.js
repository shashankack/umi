// Image optimization utilities

/**
 * Generates optimized image sources for different screen sizes
 * @param {string} imagePath - Base image path
 * @param {Object} options - Optimization options
 * @returns {Object} - Optimized image sources
 */
export const getOptimizedImageSources = (imagePath, options = {}) => {
  const {
    sizes = {
      mobile: 480,
      tablet: 768,
      desktop: 1200,
      large: 1920
    },
    quality = 85,
    format = 'webp'
  } = options;

  // For now, we'll return the original path since we don't have a CDN
  // In production, you'd integrate with a service like Cloudinary or similar
  return {
    mobile: imagePath,
    tablet: imagePath,
    desktop: imagePath,
    large: imagePath,
    original: imagePath
  };
};

/**
 * Creates a blur placeholder from an image
 * @param {string} imagePath - Image path
 * @returns {string} - Placeholder image (for now, just a tiny version)
 */
export const createBlurPlaceholder = (imagePath) => {
  // In a real implementation, you'd generate a tiny blurred version
  // For now, we'll use a data URL with a solid color
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGNUY1Ii8+Cjwvc3ZnPgo=';
};

/**
 * Preloads critical images
 * @param {Array} imagePaths - Array of critical image paths
 */
export const preloadCriticalImages = (imagePaths) => {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};

/**
 * Determines if an image should be loaded eagerly (above the fold)
 * @param {number} index - Image index
 * @param {boolean} isMobile - Is mobile device
 * @returns {string} - Loading strategy
 */
export const getLoadingStrategy = (index, isMobile = false) => {
  // Load first few images eagerly (above the fold)
  const eagerCount = isMobile ? 2 : 4;
  return index < eagerCount ? 'eager' : 'lazy';
};

/**
 * Optimizes image loading based on connection speed
 * @returns {Object} - Loading configuration
 */
export const getConnectionOptimizedLoading = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return {
        quality: 60,
        eager: false,
        preload: false
      };
    } else if (effectiveType === '3g') {
      return {
        quality: 75,
        eager: true,
        preload: false
      };
    }
  }
  
  // Default for good connections
  return {
    quality: 85,
    eager: true,
    preload: true
  };
};
