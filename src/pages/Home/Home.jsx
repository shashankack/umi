import { useLocation } from "react-router-dom";
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

  const { search } = useLocation();

  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const ourMatchaRef = useRef(null);
  const brewingRef = useRef(null);

 useEffect(() => {
  const params = new URLSearchParams(search);
  const target = params.get("scrollTo");

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  };

  const tryScroll = () => {
    if (target === "matcha") {
      if (!scrollToRef(ourMatchaRef)) {
        setTimeout(tryScroll, 100);
      }
    } else if (target === "brewing") {
      if (!scrollToRef(brewingRef)) {
        setTimeout(tryScroll, 100);
      }
    }
  };

  tryScroll();

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
}, [search, setNavbarTheme]);


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
                ? "-9%"
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
      <div className="about-sec" ref={ourMatchaRef}>
        <AboutSection />
      </div>
      <div ref={brewingRef}>
        <TutorialSection />
      </div>
    </>
  );
};

export default Home;
