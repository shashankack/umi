import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  Typography,
  Box,
  useTheme,
  IconButton,
  Grid,
  Link,
} from "@mui/material";
import { useProducts } from "../../context/ProductContext";
import { useHydration } from "../../hooks/useHydration";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import slugify from "../../utils/slugify";

// Safari detection
const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const HeroSectionNew = () => {
  const theme = useTheme();
  const { getFilteredProducts } = useProducts();
  const isHydrated = useHydration();
  const navigate = useNavigate();

  //   States
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  //   Refs
  const titleRefs = useRef([]);
  const vectorRefs = useRef([]);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const priceRef = useRef(null);
  const intervalRef = useRef(null);
  const sakuraRef = useRef(null);

  //   Styles
  const styles = {
    titleStyles: {
      fontSize: { xs: "3rem", sm: "6rem", md: "7vw" },
      fontFamily: "Gliker",
      textShadow: { xs: "2px 2px 0px #b5d782", sm: "5px 5px 0px #b5d782" },
      fontWeight: 900,
      lineHeight: 1,
      textTransform: "uppercase",
      color: theme.colors.beige,
      textAlign: { xs: "center", sm: "left" },
    },
    checkeredGrid: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      bottom: 0,
      zIndex: 20,
    },
    checkeredRow: {
      display: "flex",
    },
    checkeredSquare: {
      width: { xs: "8vw", sm: "2.6vw" },
      height: { xs: "8vw", sm: "2.6vw" },
    },
    productSlider: {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    productTitle: {
      color: theme.colors.green,
      fontFamily: theme.fonts.text,
      fontSize: { xs: "12px", sm: "20px" },
      fontWeight: 500,
      width: { xs: "15ch", sm: "80%" },
      textAlign: "center",
      textTransform: "capitalize",
      marginTop: { xs: "15%", sm: "15%" },
      marginInline: "auto",
      height: { xs: 40, sm: 60 },
    },
    swiperContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    navigationButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: theme.colors.pink,
      width: { xs: "35px", sm: "50px" },
      height: { xs: "35px", sm: "50px" },
      "&:hover": {
        backgroundColor: "transparent",
        color: theme.colors.green,
      },
      transition: "all 0.3s ease",
    },
    prevButton: {
      left: { xs: 0, sm: "5px" },
    },
    nextButton: {
      right: { xs: 0, sm: "5px" },
    },
    productInfoItem: {
      height: "100%",
      borderRight: "2px solid #b5d782",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#b5d782",
      fontWeight: 200,
      px: 2,
    },
  };

  //   Helper Functions

  const handleRedirect = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

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
        xs: { x: 0, y: 0 },
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
        xs: { x: 0, y: 0 },
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

  // Auto-slide functions
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide(); // clear any old timer
    if (products.length === 0) return; // only guard against empty list
    intervalRef.current = setInterval(() => {
      handleSlide(1).catch(console.error);
    }, 5000);
  };

  // Animation functions - EXACT copy from your HeroSection
  const animateOut = (direction = 1) => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });

      const safariConfig = isSafari
        ? {
            force3D: true,
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          }
        : {};

      // Start all OUT tweens together
      tl.add("out");

      // Info fade out
      if (nameRef.current || descRef.current || priceRef.current) {
        tl.to(
          [nameRef.current, descRef.current, priceRef.current].filter(Boolean),
          {
            opacity: 0,
            y: 10,
            duration: 0.3,
            ease: "power1.in",
          },
          "out"
        );
      }

      // Product image out
      if (imageRef.current) {
        tl.to(
          imageRef.current,
          {
            x: direction * 100,
            rotation: direction * 20,
            opacity: 0,
            duration: isSafari ? 0.5 : 0.4,
            ease: "power2.in",
            ...safariConfig,
          },
          "out"
        );
      }

      // Sakura spin (now perfectly in sync with image/info)
      if (sakuraRef.current) {
        tl.to(
          sakuraRef.current,
          {
            rotation: "+=180",
            duration: 0.5,
            ease: "power2.inOut",
            transformOrigin: "center center",
          },
          "out"
        );
      }
    });
  };

  const animateIn = (direction = 1) => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });

      const safariConfig = isSafari
        ? {
            force3D: true,
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          }
        : {};

      tl.add("in"); // <-- start both tweens together

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          {
            x: -direction * 100,
            rotation: -direction * 20,
            opacity: 0,
            ...safariConfig,
          },
          {
            x: 0,
            rotation: 0,
            opacity: 1,
            duration: isSafari ? 0.6 : 0.5,
            ease: "power2.out",
            ...safariConfig,
          },
          "in"
        );
      }

      if (nameRef.current || descRef.current || priceRef.current) {
        tl.fromTo(
          [nameRef.current, descRef.current, priceRef.current].filter(Boolean),
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5, // match image duration so they feel locked
            ease: "power2.out",
            stagger: 0.08,
          },
          "in"
        );
      }
    });
  };

  const handleSlide = async (dir) => {
    if (window.isSliding) return;
    window.isSliding = true;

    try {
      await animateOut(dir);

      setCurrentSlide((prev) => {
        const nextIndex =
          dir === 1
            ? (prev + 1) % products.length
            : (prev - 1 + products.length) % products.length;
        return nextIndex;
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      await animateIn(dir);
    } finally {
      window.isSliding = false;
    }
  };

  // Navigation functions
  const nextSlide = () => {
    stopAutoSlide();
    handleSlide(1)
      .then(() => {
        setTimeout(() => {
          resetAutoSlide();
        }, 100);
      })
      .catch(console.error);
  };

  const prevSlide = () => {
    stopAutoSlide();
    handleSlide(-1)
      .then(() => {
        setTimeout(() => {
          resetAutoSlide();
        }, 100);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!isHydrated) return;
    gsap.registerPlugin(ScrollTrigger);

    const filteredProducts = getFilteredProducts("matcha");

    const mapped = filteredProducts.map((product) => ({
      id: product.id.split("/").pop(),
      title: product.title,
      image: product.images.edges[0]?.node.url,
      price: "Coming Soon",
    }));

    setProducts(mapped);

    // 🔸 start autoplay immediately once we have items (independent of ScrollTrigger)
    if (mapped.length >= 1) {
      resetAutoSlide();
    }

    // Wait for intro completion and DOM to be ready
    const hasIntroPlayed = sessionStorage.getItem("hasPlayed") === "true";
    const setupDelay = hasIntroPlayed ? 100 : 2000;

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
          start: "top center", // start when top of container hits center of viewport
          invalidateOnRefresh: true,
          // markers: true,
          refreshPriority: -1,
          onEnter: () => {
            // 🔸 keep only continuous vector/image animations here
            gsap.delayedCall(1, () => {
              if (vectorRefs.current[0]) {
                gsap.to(vectorRefs.current[0], {
                  y: "+=15",
                  duration: 2,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[1]) {
                gsap.to(vectorRefs.current[1], {
                  y: "+=20",
                  duration: 2.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[2]) {
                gsap.to(vectorRefs.current[2], {
                  y: "+=20",
                  duration: 2.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              }

              if (vectorRefs.current[3]) {
                gsap.to(vectorRefs.current[3], {
                  y: "+=25",
                  duration: 1.8,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: 0.5,
                });
              }

              if (vectorRefs.current[4]) {
                gsap.to(vectorRefs.current[4], {
                  rotation: -360,
                  duration: 30,
                  repeat: -1,
                  ease: "none",
                  transformOrigin: "center center",
                });
              }

              if (vectorRefs.current[5]) {
                gsap.to(vectorRefs.current[5], {
                  y: "-=18",
                  duration: 2.2,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: 0.3,
                });
              }

              if (imageRef.current) {
                gsap.to(imageRef.current, {
                  y: -10,
                  duration: isSafari ? 2.5 : 2,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: 1.2,
                });
              }
            });
          },
          // ❌ removed onEnterBack / onLeave / onLeaveBack that paused autoplay
        },
      });

      // Title animations
      titleRefs.current.forEach((ref, index) => {
        tl.fromTo(
          ref,
          { y: 150 },
          { y: 0, duration: 0.8, ease: "back.out(1.2)" },
          index * 0.1
        );
      });

      // Vector entrance animations
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

    // Cleanup
    return () => {
      titleRefs.current = [];
      vectorRefs.current = [];
      stopAutoSlide();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [getFilteredProducts, isHydrated]);

  // Start autoplay as soon as products are ready (also handles cases when mapping happens later)
  useEffect(() => {
    if (!isHydrated) return;
    if (products.length >= 1) {
      resetAutoSlide();
    }
    return stopAutoSlide;
  }, [products.length, isHydrated]);

  return (
    <Stack
      ref={containerRef}
      bgcolor={theme.colors.pink}
      position="relative"
      overflow="hidden"
      height={{ xs: "auto", sm: "100vh" }}
      minHeight="100vh"
      pb={{ xs: 10, sm: 0 }}
    >
      {/* Internal Navigation Links for SEO */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 30, sm: 100 },
          left: { xs: 20, sm: "10%" },
          right: { xs: 20, sm: "10%" },
          zIndex: 30,
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          justifyContent: "center",
          opacity: 0.8,
        }}
      >
        <Link
          component={RouterLink}
          to="/shop"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          Shop Matcha
        </Link>

        <Link
          component={RouterLink}
          to="/about"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          About Us
        </Link>

        <Link
          component={RouterLink}
          to="/how-to-make-matcha-at-home"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          Brewing Guide
        </Link>

        <Link
          component={RouterLink}
          to="/our-matcha"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          Our Matcha
        </Link>

        <Link
          component={RouterLink}
          to="/blogs"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          Blog
        </Link>

        <Link
          component={RouterLink}
          to="/contact"
          sx={{
            color: theme.colors.beige,
            textDecoration: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontFamily: theme.fonts.text,
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(255,255,255,0.2)`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.green,
              transform: "translateY(-2px)",
              color: theme.colors.beige,
            },
          }}
        >
          Contact
        </Link>
      </Box>

      {/* Vectors */}
      <Box
        ref={(el) => addToVectorRef(el)}
        component="img"
        src="/images/vectors/leaf1.png"
        sx={{
          position: "absolute",
          top: { xs: "0%", sm: "10%" },
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
          bottom: "10%",
          left: -10,
          width: "12vw",
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
          top: "20%",
          right: "-5%",
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
          top: "10%",
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
          left: { xs: -50, sm: "20%" },
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
          bottom: { xs: "10%", sm: "20%" },
          right: {
            xs: -10,
            sm: "40%",
          },
          transform: {
            xs: "scaleX(-1) rotate(105deg)",
            sm: "scaleX(1)",
          },
          width: { xs: 150, sm: "16vw" },
          zIndex: 1,
        }}
      />

      {/* Checkered Grid */}
      <Box sx={styles.checkeredGrid}>
        {[...Array(2)].map((_, rowIdx) => (
          <Box key={rowIdx} sx={styles.checkeredRow}>
            {/* Mobile squares (xs) */}
            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              {[...Array(13)].map((_, colIdx) => (
                <Box
                  key={colIdx}
                  sx={{
                    ...styles.checkeredSquare,
                    backgroundColor:
                      (rowIdx + colIdx) % 2 === 0
                        ? theme.colors.green
                        : theme.colors.beige,
                  }}
                />
              ))}
            </Box>
            {/* Desktop squares (sm and up) */}
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              {[...Array(40)].map((_, colIdx) => (
                <Box
                  key={colIdx}
                  sx={{
                    ...styles.checkeredSquare,
                    backgroundColor:
                      (rowIdx + colIdx) % 2 === 0
                        ? theme.colors.green
                        : theme.colors.beige,
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Stack height="100%" direction={{ xs: "column", sm: "row" }}>
        {/* Left Section */}
        <Stack
          flex={{ xs: 1, sm: 2 }}
          pt={{ xs: "30%", sm: "13%" }}
          pl={{ xs: 0, sm: "10%" }}
          position="relative"
          mb={{ xs: "10%", sm: 0 }}
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
          alignItems={{ xs: "center", sm: "start" }}
          position="relative"
          zIndex={20}
        >
          <Stack
            mt={{ xs: 0, sm: "20%" }}
            height={{ xs: 350, sm: "65vh" }}
            // width={{ xs: "55%", sm: "70%" }}
            maxWidth={{ xs: 250, sm: 400, md: 300, lg: 300, xl: 400 }}
            width="100%"
            bgcolor={theme.colors.beige}
            borderRadius="185.5px 185.5px 0px 0px"
            border={{
              xs: `4px solid ${theme.colors.green}`,
              sm: `4px solid ${theme.colors.green}`,
            }}
            sx={{
              boxShadow: {
                xs: "none",
                sm: `6px 6px 0px ${theme.colors.green}`,
              },
            }}
          >
            {/* Product Slider */}
            {products.length > 0 && (
              <Stack sx={styles.productSlider}>
                {/* Product Title */}
                <Box overflow="hidden">
                  <Typography ref={nameRef} sx={styles.productTitle}>
                    {products[currentSlide]?.title || "Loading..."}
                  </Typography>
                </Box>

                {/* Slider Container */}
                <Box sx={styles.swiperContainer}>
                  <IconButton
                    sx={{ ...styles.navigationButton, ...styles.prevButton }}
                    onClick={prevSlide}
                  >
                    <IoIosArrowBack size={40} />
                  </IconButton>

                  <IconButton
                    sx={{ ...styles.navigationButton, ...styles.nextButton }}
                    onClick={nextSlide}
                  >
                    <IoIosArrowForward size={40} />
                  </IconButton>

                  {/* Product Image */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      ref={imageRef}
                      src={products[currentSlide]?.image}
                      alt={products[currentSlide]?.title}
                      onClick={() =>
                        handleRedirect(
                          `/shop/${slugify(products[currentSlide]?.title)}`
                        )
                      }
                      sx={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => {
                        stopAutoSlide();
                      }}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          resetAutoSlide();
                        }, 200);
                      }}
                    />
                  </Box>
                </Box>

                {/* Product Info */}
                <Grid
                  direction="row"
                  height={{ xs: 50, sm: 80 }}
                  width="100%"
                  borderTop={{
                    xs: `2px solid ${theme.colors.green}`,
                    sm: `4px solid ${theme.colors.green}`,
                  }}
                  container
                >
                  <Grid sx={styles.productInfoItem} flex={1}>
                    <Typography
                      ref={descRef}
                      sx={{
                        fontSize: { xs: "10px", sm: "14px" },
                        fontFamily: theme.fonts.text,
                        fontWeight: 500,
                      }}
                    >
                      Made in Japan
                    </Typography>
                  </Grid>
                  <Grid sx={styles.productInfoItem} flex={1}>
                    <Typography
                      ref={priceRef}
                      sx={{
                        fontSize: { xs: "10px", sm: "14px" },
                        fontFamily: theme.fonts.text,
                        fontWeight: 200,
                      }}
                    >
                      Price: {products[currentSlide]?.price}
                    </Typography>
                  </Grid>
                  <Grid sx={styles.productInfoItem} flex={1}>
                    <Box
                      component="img"
                      src="/images/vectors/sakura.png"
                      ref={sakuraRef}
                      sx={{
                        width: { xs: 40, sm: 60 },
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HeroSectionNew;
