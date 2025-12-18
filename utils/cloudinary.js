/**
 * Utility functions for handling Cloudinary URLs
 */

/**
 * Convert relative path to full Cloudinary URL
 * @param {string} relativePath - The relative path to the image
 * @returns {string} - Full Cloudinary URL
 */
export const toCloudinaryUrl = (relativePath) => {
  if (!relativePath || typeof relativePath !== "string") {
    return "/images/default-course.jpg";
  }
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // If it's already a Cloudinary URL, return as is
  if (relativePath.includes('res.cloudinary.com')) {
    return relativePath;
  }
  
  // Convert relative path to full Cloudinary URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'ds3hfu1uz';
  const folder = process.env.CLOUDINARY_FOLDER || 'btacademy';
  
  // Clean the path
  let cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // If the path already contains the folder, don't add it again
  if (cleanPath.startsWith(`${folder}/`)) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
  }
  
  // Add the folder if it's not already there
  return `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${cleanPath}`;
};

/**
 * Convert full Cloudinary URL to relative path
 * @param {string} url - Full Cloudinary URL
 * @returns {string} - Relative path
 */
export const toRelativePath = (url) => {
  if (!url) return '';
  
  // If it's already a relative path, return as is
  if (url.startsWith('/') && !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // If it's not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    
    // Find the upload folder and extract the path after it
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && pathParts.length > uploadIndex + 1) {
      // Skip version number if present (v1234567890)
      const versionIndex = uploadIndex + 1;
      const isVersion = pathParts[versionIndex] && pathParts[versionIndex].startsWith('v') && !isNaN(pathParts[versionIndex].slice(1));
      const startIndex = isVersion ? versionIndex + 1 : versionIndex;
      
      if (pathParts.length > startIndex) {
        const pathAfterUpload = pathParts.slice(startIndex);
        
        // If the path starts with the folder name, remove it
        const folder = process.env.CLOUDINARY_FOLDER || 'btacademy';
        if (pathAfterUpload[0] === folder) {
          return `/${pathAfterUpload.slice(1).join('/')}`;
        }
        
        // Return the path without the folder prefix
        return `/${pathAfterUpload.join('/')}`;
      }
    }
    
    // Fallback: return the last part of the path
    return `/${pathParts[pathParts.length - 1]}`;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return url;
  }
};

/**
 * Get optimized Cloudinary URL with transformations
 * @param {string} relativePath - The relative path to the image
 * @param {object} transformations - Cloudinary transformations
 * @returns {string} - Optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (relativePath, transformations = {}) => {
  const baseUrl = toCloudinaryUrl(relativePath);
  
  if (!transformations || Object.keys(transformations).length === 0) {
    return `${baseUrl}?q_auto,f_auto`;
  }
  
  const transformString = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `${baseUrl}?${transformString},q_auto,f_auto`;
};
