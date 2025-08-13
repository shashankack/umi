import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../context/ProductContext";
import { useHydration } from "../../hooks/useHydration";
import { useNavbarTheme } from "../../context/NavbarThemeContext";

// Import images
import sakura from "../../assets/images/vectors/sakura.png";
import leaf1 from "../../assets/images/vectors/leaf1.png";
import leaf2 from "../../assets/images/vectors/leaf2.png";
import leaf3 from "../../assets/images/vectors/leaf3.png";
import soupBowl from "../../assets/images/vectors/soup_bowl.png";
import whisk from "../../assets/images/vectors/whisk.png";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Safari detection
const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const HeroSectionNew = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery("(max-width:500px)");
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isHydrated = useHydration();

  // Refs for animations
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const originRef = useRef(null);
  const sakuraRef = useRef(null);
  const homeTextRefs = useRef([]);
  const leaf1Ref = useRef(null);
  const leaf2Ref = useRef(null);
  const leaf3Ref = useRef(null);
  const leaf4Ref = useRef(null);
  const soupBowlRef = useRef(null);
  const whiskRef = useRef(null);

  // Context and state
  const { setNavbarTheme } = useNavbarTheme();
  const { getFilteredProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Initialize refs array
  homeTextRefs.current = [];

  // Styles using MUI's sx prop and styled components approach
  const styles = {
    heroSection: {
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      backgroundColor: theme.colors.pink,
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
      width: isSmallMobile ? "8vw" : "2.6vw",
      height: isSmallMobile ? "8vw" : "2.6vw",
    },
    // Floating elements
    leaf1: {
      position: "absolute",
      top: isSmallMobile ? "8%" : "16%",
      left: 0,
      width: isSmallMobile ? "120px" : "13vw",
      zIndex: 5,
    },
    leaf2: {
      position: "absolute",
      bottom: "30%",
      left: 0,
      width: "200px",
      display: "none",
    },
    leaf3: {
      position: "absolute",
      top: "40%",
      left: "35%",
      width: "15vw",
      display: isSmallMobile ? "none" : "block",
      zIndex: 3,
      // Ensure no CSS transforms interfere with GSAP
      transform: "none",
    },
    leaf4: {
      position: "absolute",
      bottom: isSmallMobile ? "auto" : "25%",
      top: isSmallMobile ? "20%" : "auto",
      left: isSmallMobile ? "auto" : 0,
      right: isSmallMobile ? 0 : "auto",
      width: isSmallMobile ? "120px" : "13vw",
      transform: isSmallMobile
        ? "rotate(0deg) rotateY(180deg)"
        : "rotate(180deg) rotateY(180deg)",
    },
    soupBowl: {
      position: "absolute",
      bottom: "-5%",
      right: "61%",
      width: isSmallMobile ? "200px" : "18vw",
    },
    whisk: {
      position: "absolute",
      bottom: isSmallMobile ? "40%" : "65%",
      right: isSmallMobile ? "-4%" : "35%",
      width: isSmallMobile ? "150px" : "17vw",
      zIndex: 4,
      // Remove CSS transforms to prevent GSAP conflicts
      // Transform will be handled by GSAP
    },
    // Main content
    heroContent: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      maxWidth: "1800px",
      width: "100%",
      flexDirection: isSmallMobile ? "column" : "row",
      marginTop: isSmallMobile ? "-10px" : 0,
    },
    homeText: {
      zIndex: 10,
      width: "100%",
    },
    titleWrapper: {
      overflow: "hidden",
    },
    title: {
      fontSize: isSmallMobile ? "3rem" : isTablet ? "6rem" : "6vw",
      fontFamily: "Gliker",
      textShadow: isSmallMobile ? "2px 2px 0px #b5d782" : "5px 5px 0px #b5d782",
      fontWeight: 900,
      lineHeight: 1,
      marginLeft: isSmallMobile ? 0 : "140px",
      textAlign: isSmallMobile ? "center" : "left",
      textWrap: isTablet && !isSmallMobile ? "nowrap" : "wrap",
      color: theme.colors.beige,
    },
    // Product window
    productWindow: {
      width: isSmallMobile ? "100%" : "46%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      marginTop: isSmallMobile ? "20px" : 0,
      maxWidth: isSmallMobile ? "300px" : "none",
      transform: isSmallMobile ? "scale(0.7)" : "scale(1)",
      zIndex: 10,
    },
    productFrame: {
      width: isSmallMobile ? "100%" : "75%",
      height: isSmallMobile ? "450px" : "65vh",
      borderRadius: "185.5px 185.5px 0px 0px",
      border: isSmallMobile ? "1px solid #b5d782" : "4px solid #b5d782",
      background: "#fdf8ce",
      boxShadow: isSmallMobile
        ? "3px 4px 0px 0px #b5d782"
        : "8px 8px 0px 0px #b5d782",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    productTitle: {
      color: "#b5d782",
      fontSize: isSmallMobile ? "14px" : "20px",
      fontWeight: 500,
      width: "20ch",
      textAlign: "center",
      textTransform: "uppercase",
      paddingTop: isSmallMobile ? "30px" : "40px",
      flexShrink: 0,
      height: isSmallMobile ? "60px" : "100px",
    },
    productContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    },
    sliderContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    arrow: {
      fontSize: "30px",
      cursor: "pointer",
      zIndex: 10,
      transition: "all 0.3s ease",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      "&:hover": {
        transform: "translateY(-50%) scale(1.2)",
      },
      "&:active": {
        transform: "translateY(-50%) scale(0.9)",
      },
    },
    leftArrow: {
      left: "10px",
    },
    rightArrow: {
      right: "10px",
    },
    imageContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    productImage: {
      maxWidth: "90%",
      maxHeight: "90%",
      objectFit: "contain",
      cursor: "pointer",
    },
    productInfo: {
      width: "100%",
      borderTop: "3px solid #b5d782",
      flexShrink: 0,
    },
    textGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    gridItem: {
      padding: "12px",
      borderRight: "2px solid #b5d782",
      borderBottom: "2px solid #b5d782",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#b5d782",
      fontSize: "14px",
      fontWeight: 200,
      "&:last-child": {
        borderRight: "none",
      },
    },
    sakuraIcon: {
      width: isSmallMobile ? "50px" : "60px",
      height: "auto",
      cursor: "pointer",
    },
  };

  // Animation positions calculation
  const getAnimationPositions = () => {
    if (typeof window === "undefined" || !containerRef.current || !isHydrated)
      return {};

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return {};

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const vw = (percent) => (viewportWidth * percent) / 100;
    const vh = (percent) => (viewportHeight * percent) / 100;

    const isMobileCalc = viewportWidth <= 768;
    const scale = isMobileCalc ? 0.6 : isSafari ? 0.8 : 1;

    return {
      leaf1: {
        from: { x: -vw(50) * scale, y: -vh(10) * scale },
        to: { x: 0, y: 0 },
      },
      leaf2: {
        from: { x: vw(50) * scale, y: -vh(10) * scale },
        to: { x: 0, y: 0 },
      },
      leaf3: {
        from: { x: vw(30) * scale, y: -vh(30) * scale },
        to: { x: 0, y: 0 },
      },
      leaf4: {
        from: {
          x: isMobile ? vw(50) * scale : -vw(50) * scale,
          y: vh(15) * scale,
        },
        to: { x: 0, y: 0 },
      },
      soupBowl: {
        from: { y: vh(30) * scale },
        to: { y: 0 },
      },
      whisk: {
        from: { y: vh(50) * scale },
        to: { y: 0 },
      },
    };
  };

  // Auto-slide functions
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      handleSlide(1).catch(console.error);
    }, 5000);
  };

  // Animation functions
  const animateOut = (direction = 1) => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      const safariConfig = isSafari
        ? {
            force3D: true,
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          }
        : {};

      if (nameRef.current && descRef.current && originRef.current) {
        tl.to([nameRef.current, descRef.current, originRef.current], {
          opacity: 0,
          y: 10,
          duration: isSafari ? 0.4 : 0.3,
          ease: "power1.in",
          ...safariConfig,
        });
      }

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
          "<"
        );
      }

      if (sakuraRef.current) {
        tl.to(
          sakuraRef.current,
          {
            rotation: `+=${direction * 180}`,
            duration: isSafari ? 0.6 : 0.5,
            ease: "power2.inOut",
            transformOrigin: "center center",
            ...safariConfig,
          },
          "<"
        );
      }
    });
  };

  const animateIn = (direction = 1) => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      const safariConfig = isSafari
        ? {
            force3D: true,
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          }
        : {};

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
          }
        );
      }

      if (nameRef.current && descRef.current && originRef.current) {
        tl.fromTo(
          [nameRef.current, descRef.current, originRef.current],
          {
            opacity: 0,
            y: 10,
            ...safariConfig,
          },
          {
            opacity: 1,
            y: 0,
            duration: isSafari ? 0.5 : 0.4,
            ease: "power2.out",
            ...safariConfig,
          },
          "-=0.3"
        );
      }
    });
  };

  const handleSlide = async (dir) => {
    if (window.isSliding) return;
    window.isSliding = true;

    try {
      await animateOut(dir);

      setCurrent((prev) => {
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

  const nextSlide = () => {
    stopAutoSlide();
    handleSlide(1)
      .then(() => {
        resetAutoSlide();
      })
      .catch(console.error);
  };

  const prevSlide = () => {
    stopAutoSlide();
    handleSlide(-1)
      .then(() => {
        resetAutoSlide();
      })
      .catch(console.error);
  };

  // Effects
  useEffect(() => {
    if (!isHydrated) return;

    document.title = "Hero Section";

    const filteredProducts = getFilteredProducts("matcha");
    const mapped = filteredProducts.map((product) => ({
      id: product.id.split("/").pop(),
      title: product.title,
      image: product.images.edges[0]?.node.url,
      price: "Coming Soon",
    }));
    setProducts(mapped);
  }, [getFilteredProducts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(
      () => {
        ScrollTrigger.refresh();
      },
      isSafari ? 500 : 300
    );

    return () => clearTimeout(timer);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(
        () => {
          if (containerRef.current) {
            ScrollTrigger.refresh();
          }
        },
        isSafari ? 400 : 250
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isHydrated]);

  // Main animation setup
  useEffect(() => {
    setNavbarTheme("beige");

    if (!products.length || !isHydrated) return;
    if (!containerRef.current || !homeTextRefs.current.length) return;

    const setupAnimation = () => {
      const positions = getAnimationPositions();

      if (!positions.leaf1) {
        setTimeout(setupAnimation, isSafari ? 200 : 100);
        return;
      }

      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) {
          t.kill();
        }
      });

      ScrollTrigger.refresh();

      const isAtTop = window.scrollY < 100;

      const safariConfig = isSafari
        ? {
            force3D: true,
            transformPerspective: 1000,
            backfaceVisibility: "hidden",
          }
        : {};

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: isAtTop ? "top 95%" : "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none none",
          refreshPriority: -1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          ...(isSafari && {
            scroller: window,
            pin: false,
            scrub: false,
          }),

          onEnter: () => {
            // Continuous animations - separate leaf3 to avoid conflicts
            const leafRefs = [
              leaf1Ref.current,
              leaf2Ref.current,
              leaf4Ref.current,
            ].filter((ref) => ref !== null);

            if (leafRefs.length > 0) {
              gsap.to(leafRefs, {
                y: "+=10",
                duration: isSafari ? 2.5 : 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                ...safariConfig,
              });
            }

            // Separate animation for leaf3 with different timing
            if (leaf3Ref.current) {
              gsap.to(leaf3Ref.current, {
                y: "+=8",
                duration: isSafari ? 3 : 2.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 0.5, // Offset to prevent conflicts
                ...safariConfig,
              });
            }

            if (whiskRef.current) {
              // Set initial transforms for mobile
              if (isSmallMobile) {
                gsap.set(whiskRef.current, {
                  rotation: -20,
                  rotationY: 180,
                });
              }

              gsap.to(whiskRef.current, {
                y: "-=6",
                duration: isSafari ? 2.2 : 1.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 0.3, // Different delay to prevent conflicts
                ...safariConfig,
              });
            }

            if (soupBowlRef.current) {
              gsap.to(soupBowlRef.current, {
                rotation: -360,
                duration: isSafari ? 35 : 30,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center",
                ...safariConfig,
              });
            }

            if (imageRef.current) {
              gsap.to(imageRef.current, {
                y: -10,
                duration: isSafari ? 2.5 : 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                ...safariConfig,
              });
            }

            intervalRef.current = setInterval(() => {
              handleSlide(1).catch(console.error);
            }, 5000);
          },
          onLeaveBack: () => {
            stopAutoSlide();
          },
        },
      });

      // Main entrance animations
      tl.fromTo(
        homeTextRefs.current,
        {
          yPercent: -110,
          opacity: 0,
          ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
        },
        {
          yPercent: 0,
          delay: isSafari ? 0.3 : 0.2,
          opacity: 1,
          duration: isSafari ? 0.7 : 0.5,
          stagger: isSafari ? 0.3 : 0.2,
          ease: "power2.out",
          ...safariConfig,
        }
      )
        .fromTo(
          leaf1Ref.current,
          {
            ...positions.leaf1.from,
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.leaf1.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "+=0.2"
        )
        .fromTo(
          leaf2Ref.current,
          {
            ...positions.leaf2.from,
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.leaf2.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "-=0.9"
        )
        .fromTo(
          leaf3Ref.current,
          {
            ...positions.leaf3.from,
            opacity: 0, // Start invisible
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.leaf3.to,
            opacity: 1, // Fade in
            duration: isSafari ? 1.5 : 1.2,
            ease: "power2.out", // Different easing
            ...safariConfig,
          },
          "-=0.7" // Different timing
        )
        .fromTo(
          leaf4Ref.current,
          {
            ...positions.leaf4.from,
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.leaf4.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "-=0.9"
        )
        .fromTo(
          soupBowlRef.current,
          {
            ...positions.soupBowl.from,
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.soupBowl.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "-=0.9"
        )
        .fromTo(
          whiskRef.current,
          {
            ...positions.whisk.from,
            opacity: 0, // Start invisible
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.whisk.to,
            opacity: 1, // Fade in
            duration: isSafari ? 1.4 : 1.1,
            ease: "back.out(1.7)", // Different easing for smoothness
            ...safariConfig,
          },
          "-=0.5" // Different timing from leaf3
        );
    };

    const timeoutId = setTimeout(
      () => {
        if (isSafari) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setupAnimation();
                  if (window.innerWidth <= 500) {
                    setTimeout(() => {
                      if (
                        leaf4Ref.current &&
                        parseFloat(
                          window.getComputedStyle(leaf4Ref.current).opacity
                        ) < 1
                      ) {
                        leaf4Ref.current.style.opacity = "1";
                        leaf4Ref.current.style.visibility = "visible";
                      }
                      if (
                        leaf3Ref.current &&
                        parseFloat(
                          window.getComputedStyle(leaf3Ref.current).opacity
                        ) < 1
                      ) {
                        leaf3Ref.current.style.opacity = "1";
                        leaf3Ref.current.style.visibility = "visible";
                      }
                      if (
                        whiskRef.current &&
                        parseFloat(
                          window.getComputedStyle(whiskRef.current).opacity
                        ) < 1
                      ) {
                        whiskRef.current.style.opacity = "1";
                        whiskRef.current.style.visibility = "visible";
                      }
                    }, 1000);
                  }
                });
              });
            });
          });
        } else {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(setupAnimation);
            });
          });
        }
      },
      isSafari ? 200 : 100
    );

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) {
          t.kill();
        }
      });
      stopAutoSlide();
    };
  }, [products, isHydrated]);

  // Render loading state
  if (!isHydrated || !products.length) {
    return (
      <Box sx={styles.heroSection}>
        <Box sx={{ opacity: 0 }}>Loading...</Box>
      </Box>
    );
  }

  const currentProduct = products[current];

  return (
    <Box ref={containerRef} sx={styles.heroSection}>
      <Box sx={styles.heroContent}>
        {/* Home Text */}
        <Box sx={styles.homeText}>
          <Box sx={styles.titleWrapper}>
            <Typography
              variant="h2"
              ref={(el) => (homeTextRefs.current[0] = el)}
              sx={styles.title}
            >
              UMI IS
            </Typography>
          </Box>
          <Box sx={styles.titleWrapper}>
            <Typography
              variant="h2"
              ref={(el) => (homeTextRefs.current[1] = el)}
              sx={styles.title}
            >
              SO MATCHA
            </Typography>
          </Box>
          <Box sx={styles.titleWrapper}>
            <Typography
              variant="h2"
              ref={(el) => (homeTextRefs.current[2] = el)}
              sx={styles.title}
            >
              BETTER
            </Typography>
          </Box>
        </Box>

        {/* Product Window */}
        <Stack sx={styles.productWindow} spacing={0}>
          <Stack sx={styles.productFrame} spacing={0}>
            {/* Product Title */}
            <Typography variant="h2" ref={nameRef} sx={styles.productTitle}>
              {currentProduct.title}
            </Typography>

            {/* Main Product Content */}
            <Box sx={styles.productContent}>
              {/* Slider Container */}
              <Box sx={styles.sliderContainer}>
                {/* Navigation Arrows */}
                <IconButton
                  onClick={prevSlide}
                  sx={{ ...styles.arrow, ...styles.leftArrow }}
                >
                  <IoIosArrowBack color={theme.colors.pink} size={45} />
                </IconButton>

                <IconButton
                  onClick={nextSlide}
                  sx={{ ...styles.arrow, ...styles.rightArrow }}
                >
                  <IoIosArrowForward color={theme.colors.pink} size={45} />
                </IconButton>

                {/* Product Image */}
                <Box sx={styles.imageContainer}>
                  <Box
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/product/${currentProduct.id}`);
                    }}
                    onMouseEnter={() => clearInterval(intervalRef.current)}
                    onMouseLeave={resetAutoSlide}
                    sx={{ cursor: "pointer", pointerEvents: "auto" }}
                  >
                    <Box
                      component="img"
                      src={currentProduct.image}
                      ref={imageRef}
                      alt={currentProduct.title}
                      sx={styles.productImage}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Product Info */}
            <Box sx={styles.productInfo}>
              <Box sx={styles.textGrid}>
                <Box sx={styles.gridItem}>
                  <Typography ref={descRef} variant="body2">
                    Made in Japan
                  </Typography>
                </Box>

                <Box sx={styles.gridItem}>
                  <Typography ref={originRef} variant="body2">
                    <strong>Price:</strong> ₹{currentProduct.price}
                  </Typography>
                </Box>

                <Box sx={{ ...styles.gridItem, cursor: "pointer" }}>
                  <Box
                    component="img"
                    src={sakura}
                    alt="flower"
                    ref={sakuraRef}
                    sx={styles.sakuraIcon}
                  />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Stack>

        {/* Floating Elements */}
        <Box
          component="img"
          src={leaf1}
          alt=""
          ref={leaf1Ref}
          sx={styles.leaf1}
        />
        <Box
          component="img"
          src={leaf2}
          alt=""
          ref={leaf2Ref}
          sx={styles.leaf2}
        />
        <Box
          component="img"
          src={leaf3}
          alt=""
          ref={leaf3Ref}
          sx={styles.leaf3}
        />
        <Box
          component="img"
          src={leaf1}
          alt=""
          ref={leaf4Ref}
          sx={styles.leaf4}
        />
        <Box
          component="img"
          src={soupBowl}
          alt=""
          ref={soupBowlRef}
          sx={styles.soupBowl}
        />
        <Box
          component="img"
          src={whisk}
          alt=""
          ref={whiskRef}
          sx={styles.whisk}
        />
      </Box>

      {/* Checkered Grid */}
      <Box sx={styles.checkeredGrid}>
        {[...Array(2)].map((_, rowIdx) => (
          <Box key={rowIdx} sx={styles.checkeredRow}>
            {[...Array(isSmallMobile ? 13 : 40)].map((_, colIdx) => (
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
        ))}
      </Box>
    </Box>
  );
};

export default HeroSectionNew;
