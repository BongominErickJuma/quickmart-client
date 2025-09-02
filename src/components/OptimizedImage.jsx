import React, { useState, useEffect, useRef } from "react";

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  placeholderColor = "bg-gradient-to-br from-purple-50 to-indigo-50",
  onLoad = () => {},
  eager = false // Set to true for above-the-fold images
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Implement Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before the image enters viewport
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Preload image when it comes into view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.src = src;
    
    // Use the browser's cache
    if (img.complete) {
      setIsLoading(false);
    }
  }, [isInView, src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Placeholder/Loading State */}
      {(isLoading || !isInView) && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse rounded-lg`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-purple-200 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className={`absolute inset-0 ${placeholderColor} flex items-center justify-center rounded-lg`}>
          <div className="text-center p-4">
            <svg 
              className="w-8 h-8 text-gray-400 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-xs text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;