import { useRef, useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import gsap from "gsap";

import emptyCloud from "../assets/images/vectors/empty_cloud.png";
import umiText from "../assets/images/vectors/umi_text.png";

const Test = ({ NextComponent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showNext, setShowNext] = useState(false);
  const [hasPlayed] = useState(sessionStorage.getItem("hasPlayed") === "true");

  const cloudRef = useRef(null);
  const textRef = useRef(null);
  const introContainerRef = useRef(null);
  const nextComponentRef = useRef(null);

  useEffect(() => {
    if (hasPlayed) {
      setShowNext(true);
      introContainerRef.current.style.display = "none";
      nextComponentRef.current.style.transform = "translateY(0)";
      nextComponentRef.current.style.visibility = "visible";
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hasPlayed", "true");
        setShowNext(true);

        gsap
          .timeline()
          .to(
            introContainerRef.current,
            {
              y: "-100vh",
              duration: 1.2,
              ease: "power2.inOut",
            },
            0
          )
          .fromTo(
            nextComponentRef.current,
            { y: "100vh" },
            {
              y: 0,
              duration: 1.2,
              ease: "power2.inOut",
              onComplete: () => {
                introContainerRef.current.style.display = "none";
              },
            },
            0
          );
      },
    });

    tl.fromTo(
      cloudRef.current,
      { scale: 40 },
      { scale: 1, duration: 1, ease: "back.out(.5)", delay: 0.6 }
    ).fromTo(
      textRef.current,
      { scale: 0, xPercent: -50, yPercent: -50 },
      {
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        ease: "back.out",
      },
      "+=.2"
    );
  }, []);

  return (
    <>
      <Box
        ref={introContainerRef}
        height="100vh"
        bgcolor={theme.colors?.pink || "#ffcdd2"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute" // Changed to absolute
        top={0}
        left={0}
        right={0}
        overflow="hidden"
        zIndex={2000}
      >
        <Box position="relative">
          <Box width={200} ref={cloudRef}>
            <Box
              component="img"
              src={emptyCloud}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Box
            ref={textRef}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 120,
              scale: 0,
            }}
          >
            <Box
              component="img"
              src={umiText}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        ref={nextComponentRef}
        width="100%"
        position="relative" // Changed to relative
        style={{
          transform: "translateY(100vh)", // Start off-screen
          zIndex: 1,
          visibility: showNext ? "visible" : "hidden",
        }}
      >
        {showNext && <NextComponent />}
      </Box>
    </>
  );
};

export default Test;
