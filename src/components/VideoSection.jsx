import { useEffect } from "react";
import { useTheme, Grid } from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import horizontal1 from "../assets/videos/horizontal_1.mp4";
import horizontal2 from "../assets/videos/horizontal_2.mp4";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const theme = useTheme();

  const videos = [horizontal1, horizontal2];

  return (
    <Grid
      container
      bgcolor={theme.colors.beige}
      p={1}
      spacing={1}
      overflow="hidden"
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
