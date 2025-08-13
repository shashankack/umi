import "./HeroSection.scss";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { useProducts } from "../../context/ProductContext";
import { useResponsive, useHydration } from "../../hooks/useHydration";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Safari detection
const isSafari =
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import sakura from "../../assets/images/vectors/sakura.png";
import leaf1 from "../../assets/images/vectors/leaf1.png";
import leaf2 from "../../assets/images/vectors/leaf2.png";
import leaf3 from "../../assets/images/vectors/leaf3.png";
import soupBowl from "../../assets/images/vectors/soup_bowl.png";
import whisk from "../../assets/images/vectors/whisk.png";

import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const hasPlayed = sessionStorage.getItem("hasPlayed");
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const originRef = useRef(null);
  const sakuraRef = useRef(null);
  const homeTextRefs = useRef([]);

  const theme = useTheme();

  const leaf1Ref = useRef(null);
  const leaf2Ref = useRef(null);
  const leaf3Ref = useRef(null);
  const leaf4Ref = useRef(null);
  const soupBowlRef = useRef(null);
  const whiskRef = useRef(null);
  const { setNavbarTheme } = useNavbarTheme();
  const { getFilteredProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const isMobile = useResponsive(768);
  const isHydrated = useHydration();

  homeTextRefs.current = [];

  useEffect(() => {
    if (!isHydrated) return;

    const filteredProducts = getFilteredProducts("matcha");
    const mapped = filteredProducts.map((product) => ({
      id: product.id.split("/").pop(),
      title: product.title,
      image: product.images.edges[0]?.node.url,
      price: "Coming Soon",
    }));
    setProducts(mapped);
  }, [getFilteredProducts, isHydrated]);

  // Refresh ScrollTrigger after hydration and ensure DOM is ready
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(
      () => {
        ScrollTrigger.refresh();
      },
      isSafari ? 500 : 300
    ); // Longer delay for Safari

    return () => clearTimeout(timer);
  }, [isHydrated]);

  // Add resize handler to refresh ScrollTrigger when window dimensions change
  useEffect(() => {
    if (!isHydrated) return;

    let resizeTimeout;

    const handleResize = () => {
      // Debounce resize events - longer delay for Safari
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(
        () => {
          // Only refresh if container is still mounted
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

  const getAnimationPositions = () => {
    // Ensure we're in the browser and have proper dimensions
    if (typeof window === "undefined" || !containerRef.current || !isHydrated)
      return {};

    // Wait for container to be properly mounted
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return {};

    // Use container dimensions if available, fallback to window
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const vw = (percent) => (viewportWidth * percent) / 100;
    const vh = (percent) => (viewportHeight * percent) / 100;

    // Adjust positions based on screen size - more conservative for Safari
    const isMobileCalc = viewportWidth <= 768;
    const scale = isMobileCalc ? 0.6 : isSafari ? 0.8 : 1;

    return {
      leaf1: {
        from: { x: -vw(10) * scale, y: -vh(2) * scale, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1 },
      },
      leaf2: {
        from: { x: vw(10) * scale, y: -vh(2) * scale, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1 },
      },
      leaf3: {
        from: { x: -vw(8) * scale, y: vh(3) * scale, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1 },
      },
      leaf4: {
        from: { x: vw(8) * scale, y: vh(3) * scale, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1 },
      },
      soupBowl: {
        from: { y: vh(5) * scale, opacity: 0 },
        to: { y: 0, opacity: 1 },
      },
      whisk: {
        from: { x: vw(4) * scale, y: vh(3) * scale, opacity: 0 },
        to: { x: 0, y: 0, opacity: 1 },
      },
    };
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleSlide(1);
    }, 5000);
  };

  useEffect(() => {
    setNavbarTheme("beige");

    // Wait for hydration and products
    if (!products.length || !isHydrated) return;

    // Ensure all refs are available
    if (!containerRef.current || !homeTextRefs.current.length) return;

    // Wait for a frame to ensure DOM is fully rendered
    const setupAnimation = () => {
      const positions = getAnimationPositions();

      // Early return if positions couldn't be calculated
      if (!positions.leaf1) {
        // Retry after a short delay if positions aren't ready
        setTimeout(setupAnimation, isSafari ? 200 : 100);
        return;
      }

      // Kill existing ScrollTriggers to avoid duplicates
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) {
          t.kill();
        }
      });

      // Refresh ScrollTrigger to ensure accurate calculations
      ScrollTrigger.refresh();

      // Check if we're at the top of the page (hero section likely visible)
      const isAtTop = window.scrollY < 100;

      // Safari-specific GSAP settings
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
          // markers: true,
          refreshPriority: -1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          // Safari-specific optimizations
          ...(isSafari && {
            scroller: window,
            pin: false,
            scrub: false,
          }),

          onEnter: () => {
            // Continuous animations that start after scroll trigger
            const leafRefs = [
              leaf1Ref.current,
              leaf2Ref.current,
              leaf3Ref.current,
              leaf4Ref.current,
            ].filter(ref => ref !== null); // Filter out null refs

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

            if (whiskRef.current) {
              gsap.to(whiskRef.current, {
                y: "-=6",
                duration: isSafari ? 2 : 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
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

            // Auto slide
            intervalRef.current = setInterval(() => {
              handleSlide(1);
            }, 5000);
          },
          onLeaveBack: () => {
            clearInterval(intervalRef.current);
          },
        },
      });

      // Main entrance animations with opacity
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
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.leaf3.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "-=0.9"
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
            ...(isSafari && { force3D: true, backfaceVisibility: "hidden" }),
          },
          {
            ...positions.whisk.to,
            duration: isSafari ? 1.3 : 1,
            ease: "power3.out",
            ...safariConfig,
          },
          "-=0.9"
        );
    };

    // Use multiple frames and longer delay to ensure DOM is ready - extra time for Safari
    const timeoutId = setTimeout(
      () => {
        if (isSafari) {
          // Safari needs more time to stabilize
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(setupAnimation);
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
      clearInterval(intervalRef.current);
    };
  }, [products, isHydrated]); // Add isHydrated dependency

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const animateOut = (direction = 1) => {
    const tl = gsap.timeline();

    const safariConfig = isSafari
      ? {
          force3D: true,
          transformPerspective: 1000,
          backfaceVisibility: "hidden",
        }
      : {};

    tl.to([nameRef.current, descRef.current, originRef.current], {
      opacity: 0,
      y: 10,
      duration: isSafari ? 0.4 : 0.3,
      ease: "power1.in",
      ...safariConfig,
    });

    tl.to(
      imageRef.current,
      {
        x: direction * 100,
        rotation: direction * 20, // Use rotation instead of rotate for Safari
        opacity: 0,
        duration: isSafari ? 0.5 : 0.4,
        ease: "power2.in",
        ...safariConfig,
      },
      "<"
    );

    tl.to(
      sakuraRef.current,
      {
        rotation: `+=${direction * 180}`, // Use rotation instead of rotate for Safari
        duration: isSafari ? 0.6 : 0.5,
        ease: "power2.inOut",
        transformOrigin: "center center",
        ...safariConfig,
      },
      "<"
    );
  };

  const animateIn = (direction = 1) => {
    const tl = gsap.timeline();

    const safariConfig = isSafari
      ? {
          force3D: true,
          transformPerspective: 1000,
          backfaceVisibility: "hidden",
        }
      : {};

    tl.fromTo(
      imageRef.current,
      {
        x: -direction * 100,
        rotation: -direction * 20, // Use rotation instead of rotate for Safari
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
  };

  const handleSlide = (dir) => {
    animateOut(dir);
    setTimeout(() => {
      setCurrent((prev) => {
        const nextIndex =
          dir === 1
            ? (prev + 1) % products.length
            : (prev - 1 + products.length) % products.length;
        return nextIndex;
      });
      setTimeout(() => animateIn(dir), 50);
    }, 300);
  };

  const nextSlide = () => {
    resetAutoSlide();
    handleSlide(1);
  };

  const prevSlide = () => {
    resetAutoSlide();
    handleSlide(-1);
  };

  // Prevent rendering until hydrated to avoid mismatches
  if (!isHydrated || !products.length) {
    return (
      <section
        ref={containerRef}
        className="hero-section"
        style={{
          backgroundColor: theme.colors.pink,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Placeholder content to maintain layout during hydration */}
        <div style={{ opacity: 0 }}>Loading...</div>
      </section>
    );
  }

  const currentProduct = products[current];
  // console.log("Current product:", currentProduct);

  return (
    <section
      ref={containerRef}
      className="hero-section"
      style={{ backgroundColor: theme.colors.pink }}
    >
      <div className="hero-content">
        <div className="home-text" style={{ color: theme.colors.beige }}>
          <div className="title-wrapper">
            <h2 ref={(el) => (homeTextRefs.current[0] = el)}>UMI IS</h2>
          </div>
          <div className="title-wrapper">
            <h2 ref={(el) => (homeTextRefs.current[1] = el)}>SO MATCHA</h2>
          </div>
          <div className="title-wrapper">
            <h2 ref={(el) => (homeTextRefs.current[2] = el)}>BETTER</h2>
          </div>
        </div>

        <div
          className="product-window"
          style={{ fontFamily: theme.fonts.text }}
        >
          <div className="product-frame">
            <div className="slider">
              <h2 ref={nameRef}>{currentProduct.title}</h2>

              <div className="arrow left" onClick={prevSlide}>
                <IoIosArrowBack color={theme.colors.pink} size={45} />
              </div>

              <div className="arrow right" onClick={nextSlide}>
                <IoIosArrowForward color={theme.colors.pink} size={45} />
              </div>

              <div className="image-container">
                <div
                  onClick={() => {
                    navigate(
                      `/product/${currentProduct.id}`,
                      window.scrollTo(0, 0)
                    );
                  }}
                  onMouseEnter={() => clearInterval(intervalRef.current)}
                  onMouseLeave={resetAutoSlide}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                >
                  <img
                    src={currentProduct.image}
                    ref={imageRef}
                    alt={currentProduct.title}
                  />
                </div>
              </div>
            </div>
            <div className="product-info">
              <div className="text-grid">
                <div className="grid-item">
                  <p ref={descRef}>Made in Japan</p>
                </div>

                <div className="grid-item">
                  <p ref={originRef}>
                    <strong>Price:</strong> ₹{currentProduct.price}
                  </p>
                </div>

                <div className="grid-item flower" style={{ cursor: "pointer" }}>
                  <img src={sakura} alt="flower" ref={sakuraRef} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <img src={leaf1} alt="" className="leaf1" ref={leaf1Ref} />
        <img src={leaf2} alt="" className="leaf2" ref={leaf2Ref} />
        <img src={leaf3} alt="" className="leaf3" ref={leaf3Ref} />
        <img src={leaf1} alt="" className="leaf4" ref={leaf4Ref} />
        <img src={soupBowl} alt="" className="soup-bowl" ref={soupBowlRef} />
        <img src={whisk} alt="" className="whisk" ref={whiskRef} />
      </div>
      <div className="checkered-grid">
        {[...Array(2)].map((_, rowIdx) => (
          <div className="row" key={rowIdx}>
            {[...Array(isMobile ? 13 : 40)].map((_, colIdx) => (
              <div
                key={colIdx}
                className="square"
                style={{
                  backgroundColor:
                    (rowIdx + colIdx) % 2 === 0
                      ? theme.colors.green
                      : theme.colors.beige,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
