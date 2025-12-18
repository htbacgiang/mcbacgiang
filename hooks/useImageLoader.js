import { useState, useEffect, useRef } from 'react';

const useImageLoader = () => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const observerRef = useRef();

  useEffect(() => {
    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src && !loadedImages.has(src) && !failedImages.has(src)) {
              const imageLoader = new Image();
              
              imageLoader.onload = () => {
                img.src = src;
                img.setAttribute('data-loaded', 'true');
                setLoadedImages(prev => new Set([...prev, src]));
                observerRef.current?.unobserve(img);
              };
              
              imageLoader.onerror = () => {
                setFailedImages(prev => new Set([...prev, src]));
                observerRef.current?.unobserve(img);
              };
              
              imageLoader.src = src;
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadedImages, failedImages]);

  const registerImage = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve(src);
      };
      img.onerror = () => {
        setFailedImages(prev => new Set([...prev, src]));
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  };

  const isLoaded = (src) => loadedImages.has(src);
  const hasFailed = (src) => failedImages.has(src);

  return {
    registerImage,
    preloadImage,
    isLoaded,
    hasFailed,
    loadedImages,
    failedImages
  };
};

export default useImageLoader;
