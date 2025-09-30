import { useTheme, Box, useMediaQuery } from "@mui/material";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { useEffect, useRef, useState } from "react";
import { useHydration } from "../../hooks/useHydration";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useLocation } from "react-router-dom";
import { SEO, useSEO } from "../../components/SEO";

import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";

import desktopThumbnail from "../../assets/images/desktop_thumbnail.png";
import mobileThumbnail from "../../assets/images/mobile_thumbnail.png";
import introVideo from "../../assets/videos/intro.mp4";
import mobileIntroVideo from "../../assets/videos/mobile_intro.mp4";
import VideoSection from "../../components/VideoSection";
import HeroSectionNew from "../../components/HeroSection/HeroSectionNew";
import ProductsSectionNew from "../../components/Products/ProductsSectionNew";

import Footer from "../../components/Footer";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHydrated = useHydration();
  const location = useLocation();

  const { setNavbarTheme } = useNavbarTheme();
  const videoContainerRef = useRef(null);
  const introVideoRef = useRef(null);
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const ourMatchaRef = useRef(null);
  const brewingRef = useRef(null);
  const videosRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [introCompleted, setIntroCompleted] = useState(
    sessionStorage.getItem("hasPlayed") === "true"
  );

  // Get SEO data for home page
  const seoData = useSEO("/");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("scrollTo");
    setNavbarTheme("beige");

    const refsMap = {
      brewing: brewingRef,
      ourmatcha: ourMatchaRef,
    };

    let attempts = 0;
    const maxAttempts = 15;

    const scrollToRef = (ref) => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    const tryScroll = () => {
      if (!target) return;

      const key = target.toLowerCase();
      const ref = refsMap[key];
      if (!ref) return;

      if (!scrollToRef(ref)) {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 600);
        }
      }
    };

    setTimeout(tryScroll, 600);
  }, [location.search]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollMid = window.scrollY + window.innerHeight / 4.5;

          if (brewingRef.current && scrollMid >= brewingRef.current.offsetTop) {
            setNavbarTheme("beige");
          } else if (
            ourMatchaRef.current &&
            scrollMid >= ourMatchaRef.current.offsetTop
          ) {
            setNavbarTheme("pink");
          } else if (
            productsRef.current &&
            scrollMid >= productsRef.current.offsetTop
          ) {
            setNavbarTheme("pink");
          } else if (
            heroRef.current &&
            scrollMid >= heroRef.current.offsetTop
          ) {
            setNavbarTheme("beige");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setNavbarTheme]);

  useEffect(() => {
    // Wait for hydration and ensure refs exist before setting up ScrollTrigger
    if (!isHydrated || !introVideoRef.current || !videoContainerRef.current) {
      return;
    }

    // Wait for intro to complete before setting up video ScrollTrigger
    const setupVideoScrollTrigger = () => {
      const scrollTriggerInstance = gsap.fromTo(
        introVideoRef.current,
        { filter: "blur(0px) brightness(1)", scale: 1 },
        {
          filter: "blur(5px) brightness(0.8)",
          ease: "back.out",
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            toggleActions: "play none none reverse",
            refreshPriority: 1, // Higher priority
            invalidateOnRefresh: true,
          },
        }
      );

      return scrollTriggerInstance;
    };

    let scrollTriggerInstance;

    if (introCompleted) {
      // Setup immediately if intro already completed
      scrollTriggerInstance = setupVideoScrollTrigger();
    } else {
      // Wait for intro completion
      const checkIntroCompleted = () => {
        if (sessionStorage.getItem("hasPlayed") === "true") {
          setIntroCompleted(true);
          // Small delay to ensure intro exit animation is complete
          setTimeout(() => {
            scrollTriggerInstance = setupVideoScrollTrigger();
            ScrollTrigger.refresh();
          }, 1500);
        } else {
          setTimeout(checkIntroCompleted, 500);
        }
      };
      checkIntroCompleted();
    }

    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [isHydrated, introCompleted]);

  // Simplified video event handlers - only essential ones
  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
    setVideoError(null);
  };

  // Handle video lifecycle and ensure proper playback
  useEffect(() => {
    if (!isHydrated) return;

    const handleVideoPlayback = async () => {
      if (introVideoRef.current) {
        try {
          // Reset video to beginning
          introVideoRef.current.currentTime = 0;

          // Ensure video is ready to play
          if (introVideoRef.current.readyState >= 2) {
            await introVideoRef.current.play();
          } else {
            // Wait for video to be ready
            introVideoRef.current.addEventListener(
              "canplay",
              async () => {
                try {
                  await introVideoRef.current.play();
                } catch (error) {
                  console.warn("Intro video autoplay failed:", error);
                }
              },
              { once: true }
            );
          }
        } catch (error) {
          console.warn("Intro video play failed:", error);
        }
      }
    };

    // Initial playback setup with delay
    const timeoutId = setTimeout(handleVideoPlayback, 100);

    return () => {
      clearTimeout(timeoutId);
      if (introVideoRef.current) {
        introVideoRef.current.pause();
      }
    };
  }, [isHydrated]);

  // Prevent scroll jumping during intro completion
  useEffect(() => {
    if (!introCompleted && sessionStorage.getItem("hasPlayed") !== "true") {
      // During intro, prevent any scroll restoration or jumping
      const handleScroll = (e) => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
        }
      };

      const handleScrollRestore = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
      };

      // Prevent scroll restoration
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      window.addEventListener("scroll", handleScroll, { passive: false });
      window.addEventListener("beforeunload", handleScrollRestore);

      // Monitor for intro completion
      const checkCompletion = () => {
        if (sessionStorage.getItem("hasPlayed") === "true") {
          setIntroCompleted(true);
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("beforeunload", handleScrollRestore);

          // Re-enable scroll restoration after intro
          if ("scrollRestoration" in history) {
            history.scrollRestoration = "auto";
          }

          // Refresh ScrollTrigger after intro completes
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        } else {
          setTimeout(checkCompletion, 100);
        }
      };

      checkCompletion();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("beforeunload", handleScrollRestore);
      };
    }
  }, [introCompleted]);

  // Handle page visibility changes to restart video
  useEffect(() => {
    if (!isHydrated) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && introVideoRef.current) {
        // Page became visible, restart video
        setTimeout(async () => {
          try {
            introVideoRef.current.currentTime = 0;
            await introVideoRef.current.play();
          } catch (error) {
            console.warn("Intro video restart failed:", error);
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isHydrated]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        type={seoData.type}
      />
      <Box
        bgcolor={theme.colors.pink}
        height="100vh"
        // ref={videoContainerRef}
        position="relative"
      >
        {(!videoLoaded || !isHydrated) && (
          <Box
            component="img"
            src={isMobile ? mobileThumbnail : desktopThumbnail}
            alt="Video Thumbnail"
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        )}

        {videoError && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "rgba(255, 0, 0, 0.8)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 10,
              fontSize: "12px",
            }}
          >
            Video Error: {videoError.code} - {videoError.message}
          </Box>
        )}

        {isHydrated && (
          <Box
            ref={introVideoRef}
            component="video"
            autoPlay
            muted
            loop
            preload="metadata"
            playsInline
            src={isMobile ? mobileIntroVideo : introVideo}
            onLoadedData={handleVideoLoadedData}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "relative",
              zIndex: 2,
            }}
          />
        )}
      </Box>

      <div ref={heroRef}>
        {/* <HeroSection theme={theme} /> */}
        <HeroSectionNew />
      </div>
      <div
        ref={productsRef}
        className="products-sec"
        style={{ position: "relative" }}
      >
        <ProductsSectionNew />
      </div>
      <div className="about-sec" ref={ourMatchaRef}>
        <AboutSection />
      </div>
      <div ref={videosRef}>
        <VideoSection />
      </div>
      <div ref={brewingRef}>
        <TutorialSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;
