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
          <Box
            component="video"
            src={horizontal1}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            playsInline
          />
        </Grid>
        <Grid size={isMobile ? 12 : 6}>
          <Box
            component="video"
            src={horizontal2}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            muted
            loop
            playsInline
          />
        </Grid>
      </Grid>

      {!isMobile && (
        <Grid container size={12} justifyContent="space-evenly" height="60vh">
          <Grid size={3} height="100%">
            <Box
              component="video"
              src={vertical1}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            />
          </Grid>
          <Grid size={3} height="100%">
            <Box
              component="video"
              src={vertical2}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            />
          </Grid>
          <Grid size={3} height="100%">
            <Box
              component="video"
              src={vertical3}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoSection;
