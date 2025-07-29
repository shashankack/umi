import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const LazyImage = ({ 
  src, 
  alt, 
  placeholder,
  sx = {},
  component = "img",
  onLoad,
  loading = "lazy",
  decoding = "async",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: placeholder ? `url(${placeholder})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: placeholder ? 'blur(5px)' : 'none',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 0 : 1,
          }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <Box
          component={component}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0,
            ...sx,
          }}
        />
      )}
    </Box>
  );
};

export default LazyImage;
