import { useRef, useEffect } from "react";
import { useTheme, useMediaQuery, Grid } from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import horizontal1 from "../assets/videos/horizontal_1.mp4";
import horizontal2 from "../assets/videos/horizontal_2.mp4";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const videos = [horizontal1, horizontal2];
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  const addToVideoRefs = (el) => {
    if (el && !videoRefs.current.includes(el)) {
      videoRefs.current.push(el);
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      gsap.fromTo(
        video,
        { xPercent: index % 2 === 0 ? -100 : 100, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(.8)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
          item
          style={{ position: "relative" }}
          key={index}
        >
          <video
            ref={addToVideoRefs}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src={video} type="video/mp4" />
          </video>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoSection;
