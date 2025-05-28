import { useTheme, Box } from "@mui/material";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// import HeroSection from "../../components/HeroSection/HeroSection";
import HeroSection from "../../components/HeroSection/HeroSection";
import ProductsSection from "../../components/Products/ProductsSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";
import CurvedMarquee from "../../components/CurvedMarquee/CurvedMarquee";

import introVideo from "../../assets/videos/intro.mp4";

const Home = () => {
  const theme = useTheme();
  const { setNavbarTheme } = useNavbarTheme();
  const location = useLocation();

  const videoContainerRef = useRef(null);
  const introVideoRef = useRef(null);
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const ourMatchaRef = useRef(null);
  const brewingRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("scrollTo");

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
    const handleScroll = () => {
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
      } else if (heroRef.current && scrollMid >= heroRef.current.offsetTop) {
        setNavbarTheme("beige");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setNavbarTheme]);

  useEffect(() => {
    gsap.fromTo(
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
        },
      }
    );
  }, []);

  return (
    <>
      <Box bgcolor={theme.colors.pink} height="100vh" ref={videoContainerRef}>
        <Box
          ref={introVideoRef}
          component="video"
          autoPlay
          muted
          loop
          playsInline
          src={introVideo}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <div ref={heroRef}>
        <HeroSection theme={theme} />
      </div>
      <div
        ref={productsRef}
        className="products-sec"
        style={{ position: "relative" }}
      >
        <ProductsSection />
        <div
          className="marquee"
          style={{
            position: "absolute",
            zIndex: 100,
            bottom:
              window.innerWidth <= 400
                ? "-9%"
                : window.innerWidth <= 430
                ? "-8.8%"
                : window.innerWidth <= 500
                ? "-8.2%"
                : window.innerWidth <= 1440
                ? "-11%"
                : window.innerWidth <= 1500
                ? "-10%"
                : "-9%",
            left: "0",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <CurvedMarquee />
        </div>
      </div>
      <div className="about-sec" ref={ourMatchaRef}>
        <AboutSection />
      </div>
      <Box
        height="100vh"
        bgcolor={theme.colors.pink}
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontFamily={theme.fonts.text}
        color={theme.colors.beige}
        fontSize={30}
      >
        <Box height={600} width={400} bgcolor={theme.colors.beige}></Box>
        video section
      </Box>
      <div ref={brewingRef}>
        <TutorialSection />
      </div>
    </>
  );
};

export default Home;
