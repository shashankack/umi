import { useRef, useEffect } from "react";
import { useTheme, useMediaQuery, Grid } from "@mui/material";

import horizontal1 from "../assets/videos/horizontal_1.mp4";
import horizontal2 from "../assets/videos/horizontal_2.mp4";
import vertical1 from "../assets/videos/vertical_1.mp4";
import vertical2 from "../assets/videos/vertical_2.mp4";
import vertical3 from "../assets/videos/vertical_3.mp4";

const VideoSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Refs for all videos
  const h1Ref = useRef();
  const h2Ref = useRef();
  const v1Ref = useRef();
  const v2Ref = useRef();
  const v3Ref = useRef();

  useEffect(() => {
    [h1Ref, h2Ref, v1Ref, v2Ref, v3Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.play().catch((err) => {
          alert("Autoplay blocked:", err);
        });
      }
    });
  }, []);

  return (
    <Grid container bgcolor={theme.colors.beige} p={1} spacing={1}>
      <Grid container spacing={1}>
        <Grid item size={isMobile ? 12 : 6}>
          <video
            ref={h1Ref}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src={horizontal1} type="video/mp4" />
          </video>
        </Grid>
        <Grid item size={isMobile ? 12 : 6}>
          <video
            ref={h2Ref}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src={horizontal2} type="video/mp4" />
          </video>
        </Grid>
      </Grid>

      {!isMobile && (
        <Grid container size={12} justifyContent="space-evenly" height="60vh">
          <Grid item size={3} height="100%">
            <video
              ref={v1Ref}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical1} type="video/mp4" />
            </video>
          </Grid>
          <Grid item size={3} height="100%">
            <video
              ref={v2Ref}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical2} type="video/mp4" />
            </video>
          </Grid>
          <Grid item size={3} height="100%">
            <video
              ref={v3Ref}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical3} type="video/mp4" />
            </video>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoSection;
