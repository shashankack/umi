import React, { useEffect, useRef, useState } from "react";
import { Stack, Typography, Box, useTheme } from "@mui/material";
import { useProducts } from "../../context/ProductContext";
import { useHydration } from "../../hooks/useHydration";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const HeroSectionNew = () => {
  const theme = useTheme();
  const { getFilteredProducts } = useProducts();
  const isHydrated = useHydration();

  //   States
  const [products, setProducts] = useState([]);

  //   Refs
  const titleRefs = useRef([]);
  const vectorRefs = useRef([]);
  const containerRef = useRef(null);

  //   Styles
  const styles = {
    titleStyles: {
      fontSize: { xs: "3rem", sm: "6rem", md: "6vw" },
      fontFamily: "Gliker",
      textShadow: { xs: "2px 2px 0px #b5d782", sm: "5px 5px 0px #b5d782" },
      fontWeight: 900,
      lineHeight: 1,
      textTransform: "uppercase",
      color: theme.colors.beige,
      textAlign: { xs: "center", sm: "left" },
    },
  };

  //   Helper Functions
  const addToTitleRef = (ref) => {
    if (ref && !titleRefs.current.includes(ref)) {
      titleRefs.current.push(ref);
    }
  };

  const addToVectorRef = (ref) => {
    if (ref && !vectorRefs.current.includes(ref)) {
      vectorRefs.current.push(ref);
    }
  };

  // Vector animation configuration
  const vectorAnimationConfig = [
    {
      // Leaf1 (top-left) - index 0
      from: {
        xs: { x: -150, y: -100 },
        sm: { x: -200, y: -150 },
      },
    },
    {
      // Flipped leaf (desktop only) - index 1
      from: {
        xs: { x: 0, y: 0 }, // Not used on mobile
        sm: { x: -200, y: 300 },
      },
    },
    {
      // Flipped leaf (mobile only) - index 2
      from: {
        xs: { x: 150, y: 200 },
        sm: { x: 0, y: 0 }, // Not used on desktop
      },
    },
    {
      // Leaf3 (center-top, desktop only) - index 3
      from: {
        xs: { x: 0, y: 0 }, // Not used on mobile
        sm: { x: 0, y: -200 },
      },
    },
    {
      // Soup bowl - index 4
      from: {
        xs: { x: -250, y: 150 },
        sm: { x: -300, y: 200 },
      },
    },
    {
      // Whisk - index 5
      from: {
        xs: { x: 200, y: 150 },
        sm: { x: 250, y: 200 },
      },
    },
  ];

  useEffect(() => {
    if (!isHydrated) return;

    document.title = "Hero Section";
    gsap.registerPlugin(ScrollTrigger);

    const filteredProducts = getFilteredProducts("matcha");
    const mapped = filteredProducts.map((product) => ({
      id: product.id.split("/").pop(),
      title: product.title,
      image: product.images.edges[0]?.node.url,
      price: "Coming Soon",
    }));
    setProducts(mapped);

    // Wait for intro completion and DOM to be ready
    const hasIntroPlayed = sessionStorage.getItem("hasPlayed") === "true";
    const setupDelay = hasIntroPlayed ? 100 : 2000; // Longer delay if intro is playing

    const setupAnimations = () => {
      if (!containerRef.current || !titleRefs.current.length) {
        setTimeout(setupAnimations, 100);
        return;
      }

      // Refresh ScrollTrigger to ensure accurate calculations
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          markers: false,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          onEnter: () => {
            // Continuous animations start after a 1-second delay
            gsap.delayedCall(1, () => {
              // Leaves - yoyo animations (Y-axis only)
              if (vectorRefs.current[0]) {
                // Leaf1 (top-left) - index 0
                gsap.to(vectorRefs.current[0], {
                  y: "+=15",
                  rotation: 5,
                  duration: 2,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[1]) {
                // Flipped leaf (desktop only) - index 1
                gsap.to(vectorRefs.current[1], {
                  y: "+=20",
                  rotation: -3,
                  scaleY: -1, // Preserve CSS scaleY for desktop
                  duration: 2.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[2]) {
                // Flipped leaf (mobile only) - index 2
                gsap.to(vectorRefs.current[2], {
                  y: "+=20",
                  rotation: -3,
                  duration: 2.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[3]) {
                // Leaf3 (center-top, desktop only) - index 3
                gsap.to(vectorRefs.current[3], {
                  y: "+=25",
                  rotation: 4,
                  duration: 1.8,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: 0.5, // Offset to prevent conflicts
                });
              }

              if (vectorRefs.current[4]) {
                // Soup bowl - index 4 (anti-clockwise rotation)
                gsap.to(vectorRefs.current[4], {
                  rotation: -360,
                  duration: 30,
                  repeat: -1,
                  ease: "none",
                  transformOrigin: "center center",
                });
              }

              if (vectorRefs.current[5]) {
                // Whisk - index 5 (yoyo animation with preserved transforms)
                const isSmallScreen = window.innerWidth < 600;
                const baseScaleX = isSmallScreen ? -1 : 1;
                const baseRotation = isSmallScreen ? 10 : 0;

                gsap.to(vectorRefs.current[5], {
                  y: "-=18",
                  // rotation: baseRotation + 8, // Add to base rotation
                  // scaleX: baseScaleX, // Preserve CSS scaleX
                  duration: 2.2,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: 0.3, // Different delay to prevent conflicts
                });
              }
            });
          },
        },
      });

      // Title animations
      titleRefs.current.forEach((ref, index) => {
        tl.fromTo(
          ref,
          { y: 100 },
          { y: 0, duration: 0.8, ease: "back.out(1.2)" },
          index * 0.1
        );
      });

      // Vector animations - determine screen size for animation values
      const isSmallScreen = window.innerWidth < 600;

      vectorRefs.current.forEach((ref, index) => {
        if (ref && vectorAnimationConfig[index]) {
          const config = vectorAnimationConfig[index];
          const fromValues = isSmallScreen ? config.from.xs : config.from.sm;

          tl.fromTo(
            ref,
            {
              x: fromValues.x,
              y: fromValues.y,
              opacity: 0,
              scale: 0.8,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.2)",
            },
            0.1 + index * 0.09
          );
        }
      });
    };

    setTimeout(setupAnimations, setupDelay);

    // Cleanup refs array on component mount
    return () => {
      titleRefs.current = [];
      vectorRefs.current = [];
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [getFilteredProducts, isHydrated]);

  return (
    <Stack
      ref={containerRef}
      height="100vh"
      bgcolor={theme.colors.pink}
      position="relative"
      overflow="hidden"
    >
      {/* Vectors */}
      <Box
        ref={(el) => addToVectorRef(el)}
        component="img"
        src="/images/vectors/leaf1.png"
        sx={{
          position: "absolute",
          top: { xs: "15%", sm: "15%" },
          left: -10,
          width: { xs: 100, sm: "12vw" },
          zIndex: 1,
        }}
      />
      <Box
        ref={(el) => addToVectorRef(el)}
        display={{ xs: "none", sm: "block" }}
        component="img"
        src="/images/vectors/flipped_leaf_desktop.png"
        sx={{
          position: "absolute",
          top: { xs: "20%", sm: "auto" },
          bottom: { xs: "auto", sm: "40%" },
          left: { xs: "auto", sm: 0 },
          right: { xs: 0, sm: "auto" },
          transform: { xs: "scaleX(-1)", sm: "scaleY(-1)" },
          width: { xs: 100, sm: "12vw" },
          zIndex: 1,
        }}
      />
      <Box
        ref={(el) => addToVectorRef(el)}
        display={{ xs: "block", sm: "none" }}
        component="img"
        src="/images/vectors/flipped_leaf_mobile.png"
        sx={{
          position: "absolute",
          top: { xs: "-5%", sm: "auto" },
          bottom: { xs: "auto", sm: "20%" },
          left: { xs: "auto", sm: 0 },
          right: { xs: -20, sm: "auto" },
          width: { xs: 120, sm: "12vw" },
          zIndex: 1,
        }}
      />
      <Box
        ref={(el) => addToVectorRef(el)}
        display={{ xs: "none", sm: "block" }}
        component="img"
        src="/images/vectors/leaf3.png"
        sx={{
          position: "absolute",
          top: "25%",
          left: "40%",
          width: "14vw",
          zIndex: 1,
        }}
      />
      <Box
        ref={(el) => addToVectorRef(el)}
        component="img"
        src="/images/vectors/soup_bowl.png"
        sx={{
          position: "absolute",
          bottom: 0,
          left: { xs: -50, sm: 400 },
          width: { xs: 200, sm: "17vw" },
          zIndex: 1,
        }}
      />
      <Box
        ref={(el) => addToVectorRef(el)}
        component="img"
        src="/images/vectors/whisk.png"
        sx={{
          position: "absolute",
          bottom: { xs: "20%", sm: "20%" },
          right: {
            xs: 0,
            sm: "40%",
          },
          transform: {
            xs: "scaleX(-1) rotate(90deg)",
            sm: "scaleX(1)",
          },
          width: { xs: 150, sm: "16vw" },
          zIndex: 1,
        }}
      />

      <Box
        bgcolor={theme.colors.beige}
        border={2}
        height={{ xs: 60, sm: 100 }}
        position="absolute"
        bottom={0}
        width="100%"
        zIndex={10}
      >
        Checkerd Section
      </Box>

      <Stack height="100%" direction={{ xs: "column", sm: "row" }}>
        {/* Left Section */}
        <Stack
          flex={{ xs: 1, sm: 2 }}
          pt={{ xs: "15%", sm: "15%" }}
          pl={{ xs: 0, sm: "10%" }}
          position="relative"
          zIndex={20}
        >
          <Box overflow="hidden">
            <Typography ref={(el) => addToTitleRef(el)} sx={styles.titleStyles}>
              Umi is
            </Typography>
          </Box>
          <Box overflow="hidden">
            <Typography ref={(el) => addToTitleRef(el)} sx={styles.titleStyles}>
              So matcha
            </Typography>
          </Box>
          <Box overflow="hidden">
            <Typography ref={(el) => addToTitleRef(el)} sx={styles.titleStyles}>
              better
            </Typography>
          </Box>
        </Stack>

        {/* Right Section */}
        <Stack
          flex={{ xs: 2, sm: 1 }}
          justifyContent="start"
          alignItems="center"
          position="relative"
          zIndex={20}
        >
          <Stack
            mt={{ xs: 0, sm: "20%" }}
            height={{ xs: 350, sm: "65vh" }}
            width={{ xs: "55%", sm: "70%" }}
            bgcolor={theme.colors.beige}
            borderRadius="185.5px 185.5px 0px 0px"
            border={{
              xs: `4px solid ${theme.colors.green}`,
              sm: `6px solid ${theme.colors.green}`,
            }}
          ></Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HeroSectionNew;
