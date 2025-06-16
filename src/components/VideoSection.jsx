import { Box, useTheme, useMediaQuery, Grid } from "@mui/material";

import horizontal1 from "../assets/videos/horizontal_1.mp4";
import horizontal2 from "../assets/videos/horizontal_2.mp4";
import vertical1 from "../assets/videos/vertical_1.mp4";
import vertical2 from "../assets/videos/vertical_2.mp4";
import vertical3 from "../assets/videos/vertical_3.mp4";

const VideoSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container bgcolor={theme.colors.beige} p={1} gap={1} spacing={1}>
      <Grid container>
        <Grid size={isMobile ? 12 : 6}>
          <video
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src={horizontal1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
        <Grid size={isMobile ? 12 : 6}>
          <video
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src={horizontal2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Grid>
      </Grid>

      {!isMobile && (
        <Grid container size={12} justifyContent="space-evenly" height="60vh">
          <Grid size={3} height="100%">
            <video
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid size={3} height="100%">
            <video
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical2} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid size={3} height="100%">
            <video
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
            >
              <source src={vertical3} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoSection;
