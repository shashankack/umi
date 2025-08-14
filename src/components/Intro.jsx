import { useRef, useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import emptyCloud from "../assets/images/vectors/empty_cloud.png";
import umiText from "../assets/images/vectors/umi_text.png";

const Intro = ({ NextComponent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showNext, setShowNext] = useState(false);
  const [hasPlayed] = useState(sessionStorage.getItem("hasPlayed") === "true");

  const cloudRef = useRef(null);
  const textRef = useRef(null);
  const introContainerRef = useRef(null);
  const nextComponentRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Ensure refs exist before setting up animations
    if (!cloudRef.current || !textRef.current || !introContainerRef.current || !nextComponentRef.current) {
      return;
    }

    if (hasPlayed) {
      // Immediately show the next component in its final state
      setShowNext(true);
      introContainerRef.current.style.display = "none";
      nextComponentRef.current.style.transform = "translateY(0)";
      nextComponentRef.current.style.visibility = "visible";
      
      // Refresh ScrollTrigger after immediate setup
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      
      return;
    }

    // Start with NextComponent visible but off-screen
    setShowNext(true);
    nextComponentRef.current.style.transform = "translateY(100vh)";
    nextComponentRef.current.style.visibility = "visible";

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hasPlayed", "true");

        // Exit animation
        gsap.timeline()
          .to(introContainerRef.current, {
            y: "-100vh",
            duration: 1.2,
            ease: "power2.inOut",
          }, 0)
          .to(nextComponentRef.current, {
            y: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
              // Hide intro container after animation
              if (introContainerRef.current) {
                introContainerRef.current.style.display = "none";
              }
              // Refresh ScrollTrigger after intro completes
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();
              });
            }
          }, 0);
      },
    });

    // Main intro animations
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
        duration: 0.8,
      },
      "+=.2"
    );

    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, [hasPlayed]);

  return (
    <>
      <Box
        ref={introContainerRef}
        height="100vh"
        bgcolor={theme.colors?.pink || "#ffcdd2"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        overflow="hidden"
        zIndex={2000}
        style={{ display: hasPlayed ? "none" : "flex" }}
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
        position="static"
        style={{
          transform: hasPlayed ? "translateY(0)" : "translateY(100vh)",
          visibility: showNext ? "visible" : "hidden",
        }}
      >
        {showNext && <NextComponent />}
      </Box>
    </>
  );
};

export default Intro;
