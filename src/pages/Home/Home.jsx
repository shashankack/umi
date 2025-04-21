import "./Home.scss";
import { useTheme } from "@mui/material/styles";
import HeroSection from "../../components/HeroSection/HeroSection";
import ProductsSection from "../../components/Products/ProductsSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";

import CurvedMarquee from "../../components/CurvedMarquee/CurvedMarquee";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { useEffect, useRef } from "react";

const Home = () => {
  const theme = useTheme();
  const { setNavbarTheme } = useNavbarTheme();

  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const aboutRef = useRef(null);
  const tutorialRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight / 4.5;

      if (tutorialRef.current && scrollMid >= tutorialRef.current.offsetTop) {
        setNavbarTheme("beige");
      } else if (aboutRef.current && scrollMid >= aboutRef.current.offsetTop) {
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
                ? "-9.5%"
                : window.innerWidth <= 500
                ? "-8.5%"
                : window.innerWidth <= 1440
                ? "-11%"
                : "-9%",
            left: "0",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <CurvedMarquee />
        </div>
      </div>
      <div className="about-sec" ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={tutorialRef}>
        <TutorialSection />
      </div>
    </>
  );
};

export default Home;
