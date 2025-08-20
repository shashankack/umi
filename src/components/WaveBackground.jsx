// WaveBackground.jsx
import React, { useId, forwardRef } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

/**
 * Props:
 * - height: "100%" | "30vh" | 300 | "300px"
 * - color: wave fill color (default "#F3EDB8")
 * - speed: number — 1 => 5s, 2 => 2.5s, 0.5 => 10s
 * - offsetY: number — vertical shift (default -238)
 */
const WaveBackground = forwardRef(function WaveBackground(
  { height = "100%", color = "#F3EDB8", speed = 1, offsetY = -238 },
  ref
) {
  const uid = useId();
  const waveId = `wavepath-${uid}`;
  const motionId = `motionpath-${uid}`;
  const duration = `${5 / (speed || 1)}s`;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="svg"
      height={typeof height === "number" ? height : height}
      sx={{ width: "100%", height, display: "block" }}
      viewBox={`0 0 ${isMobile ? 400 : 800} 1000`}
      preserveAspectRatio="none"
      shapeRendering="auto"
      role="img"
      aria-label="Animated wave"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path
          id={waveId}
          d={`M 0 2000 0 500
              Q 101 530 202 500
              t 202 0 202 0 202 0 202 0 202 0 202 0 202 0
              v1000 z`}
        />
        <path id={motionId} d="M -404 0 0 0" />
      </defs>

      <g>
        {/* Expose the element with the 'y' attribute for GSAP */}
        <use ref={ref} href={`#${waveId}`} y={offsetY} fill={color}>
          <animateMotion dur={duration} repeatCount="indefinite">
            <mpath href={`#${motionId}`} />
          </animateMotion>
        </use>
      </g>
    </Box>
  );
});

export default WaveBackground;
