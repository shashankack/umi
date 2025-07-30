import { useRef, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

const SafariVideoFix = ({ 
  src, 
  mobileSrc, 
  isMobile, 
  thumbnail, 
  mobileThumbnail,
  onVideoLoad,
  sx = {},
  ...props 
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detect Safari and other browsers
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  const videoSrc = isMobile ? mobileSrc : src;
  const thumbSrc = isMobile ? mobileThumbnail : thumbnail;

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onVideoLoad?.(true);
  }, [onVideoLoad]);

  const handleVideoError = useCallback(() => {
    setHasError(true);
    onVideoLoad?.(false);
    
    // Retry logic for Safari
    if (attemptCount < 3) {
      setTimeout(() => {
        setAttemptCount(prev => prev + 1);
        setHasError(false);
        setIsLoaded(false);
      }, 1000);
    }
  }, [attemptCount, onVideoLoad]);

  const forcePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        // Apply Safari-specific fixes only for Safari/iOS
        if (isSafari || isIOS) {
          video.muted = true;
          video.playsInline = true;
        }
        
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // Only retry aggressively for Safari
      if (isSafari || isIOS) {
        console.warn('Safari video play failed, retrying:', error);
        setTimeout(async () => {
          try {
            await video.play();
          } catch (retryError) {
            console.warn('Safari video retry failed:', retryError);
          }
        }, 100);
      } else {
        console.warn('Video play failed:', error);
      }
    }
  }, [isSafari, isIOS]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      forcePlay();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Safari-specific initialization
    if (isSafari || isIOS) {
      video.load();
      setTimeout(forcePlay, 200);
    } else {
      // For Chrome and other browsers, just try to play normally
      setTimeout(forcePlay, 100);
    }

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [attemptCount, handleVideoLoad, handleVideoError, forcePlay, isSafari]);

  // Handle page visibility changes (Safari-specific)
  useEffect(() => {
    if (!isSafari && !isIOS) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(forcePlay, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [forcePlay, isSafari, isIOS]);

  // Handle focus/blur for Safari
  useEffect(() => {
    if (!isSafari && !isIOS) return;
    
    const handleFocus = () => {
      setTimeout(forcePlay, 100);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [forcePlay, isSafari, isIOS]);

  return (
    <Box position="relative" width="100%" height="100%">
      {/* Thumbnail fallback */}
      {(!isLoaded || hasError) && (
        <Box
          component="img"
          src={thumbSrc}
          alt="Video Thumbnail"
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: hasError ? 10 : 1,
          }}
        />
      )}

      {/* Video element */}
      <Box
        key={`video-${attemptCount}`} // Force re-render on retry
        ref={videoRef}
        component="video"
        autoPlay={!isSafari && !isIOS} // Let Safari handle autoplay manually
        muted={true}
        loop
        playsInline
        webkit-playsinline="true"
        preload={isSafari || isIOS ? "auto" : "metadata"}
        src={`${videoSrc}?v=${Date.now()}`} // Cache busting
        sx={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
          position: "relative",
          zIndex: 2,
          opacity: isLoaded && !hasError ? 1 : 0,
          transition: 'opacity 0.5s ease',
          ...sx
        }}
        {...props}
      />

      {/* Error message for debugging */}
      {hasError && attemptCount >= 3 && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={11}
          color="white"
          bgcolor="rgba(0,0,0,0.7)"
          p={2}
          borderRadius={1}
          fontSize="12px"
        >
          Video failed to load
        </Box>
      )}
    </Box>
  );
};

export default SafariVideoFix;
