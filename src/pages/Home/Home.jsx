import { useTheme, Box } from "@mui/material";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import HeroSection from "../../components/HeroSection/HeroSection";
import ProductsSection from "../../components/Products/ProductsSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";
import CurvedMarquee from "../../components/CurvedMarquee/CurvedMarquee";

// import "./Home.scss";

const Home = () => {
  const theme = useTheme();
  const { setNavbarTheme } = useNavbarTheme();
  const location = useLocation();

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

  return (
    <>
      <Box
        height="100vh"
        bgcolor={theme.colors.beige}
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontFamily={theme.fonts.text}
        color={theme.colors.pink}
        fontSize={30}
      >
        video section
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
