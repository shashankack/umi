import { useEffect, useRef } from "react";
import { useTheme, Grid } from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useHydration } from "../hooks/useHydration";

import horizontal1 from "../assets/videos/horizontal_1.mp4";
import horizontal2 from "../assets/videos/horizontal_2.mp4";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const theme = useTheme();
  const isHydrated = useHydration();
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  const videos = [horizontal1, horizontal2];

  // Initialize video refs array
  videoRefs.current = [];

  const addToRefs = (el) => {
    if (el && !videoRefs.current.includes(el)) {
      videoRefs.current.push(el);
    }
  };

  // Handle video lifecycle and ensure proper playback
  useEffect(() => {
    if (!isHydrated) return;

    const handleVideoPlayback = async () => {
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      videoRefs.current.forEach(async (video, index) => {
        if (video) {
          try {
            // Reset video to beginning
            video.currentTime = 0;
            
            // Ensure video is ready to play
            if (video.readyState >= 2) {
              await video.play();
            } else {
              // Wait for video to be ready
              video.addEventListener('canplay', async () => {
                try {
                  await video.play();
                } catch (error) {
                  console.warn(`Video ${index} autoplay failed:`, error);
                }
              }, { once: true });
            }
          } catch (error) {
            console.warn(`Video ${index} play failed:`, error);
          }
        }
      });
    };

    // Setup intersection observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleVideoPlayback();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Initial playback setup
    handleVideoPlayback();

    return () => {
      observer.disconnect();
      // Pause all videos on cleanup
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
    };
  }, [isHydrated]);

  // Handle page visibility changes to restart videos
  useEffect(() => {
    if (!isHydrated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, restart videos
        setTimeout(() => {
          videoRefs.current.forEach(async (video) => {
            if (video) {
              try {
                video.currentTime = 0;
                await video.play();
              } catch (error) {
                console.warn('Video restart failed:', error);
              }
            }
          });
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <Grid
        container
        bgcolor={theme.colors.beige}
        p={1}
        spacing={1}
        overflow="hidden"
        style={{ minHeight: '400px' }}
      >
        {/* Placeholder during hydration */}
        <div style={{ width: '100%', height: '400px', backgroundColor: theme.colors.beige }} />
      </Grid>
    );
  }

  return (
    <Grid
      container
      bgcolor={theme.colors.beige}
      p={1}
      spacing={1}
      overflow="hidden"
      ref={containerRef}
    >
      {videos.map((video, index) => (
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
          style={{ position: "relative" }}
          key={index}
        >
          <video
            ref={addToRefs}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="metadata"
            playsInline
            onLoadedData={(e) => {
              // Ensure video plays when loaded
              e.target.play().catch(console.warn);
            }}
            onError={(e) => {
              console.warn(`Video ${index} error:`, e);
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoSection;
