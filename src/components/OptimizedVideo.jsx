import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const OptimizedVideo = ({ 
  src, 
  mobileSrc,
  poster,
  alt,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "auto",
  onLoadedData,
  sx = {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

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
        rootMargin: '100px',
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (onLoadedData) onLoadedData();
  };

  const videoSrc = isMobile && mobileSrc ? mobileSrc : src;

  return (
    <Box
      ref={videoRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        ...sx,
      }}
      {...props}
    >
      {/* Poster image while loading */}
      {poster && !isLoaded && (
        <Box
          component="img"
          src={poster}
          alt={alt}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
      )}
      
      {/* Video element */}
      {isInView && (
        <Box
          component="video"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          src={videoSrc}
          onLoadedData={handleLoadedData}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </Box>
  );
};

export default OptimizedVideo;
