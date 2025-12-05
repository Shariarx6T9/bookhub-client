import React, { useState, useRef, useEffect } from "react";

const LazyImage = React.memo(({ src, alt, className, fallback }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = new Image();
        img.onload = () => setLoaded(true);
        img.onerror = () => setError(true);
        img.src = src;
        observer.disconnect();
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  if (error) return fallback || <div className={`${className} bg-gray-700 flex items-center justify-center`}>📚</div>;

  return (
    <div ref={imgRef} className={className}>
      {loaded ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className={`${className} bg-gray-800 animate-pulse`} />
      )}
    </div>
  );
});

export default LazyImage;