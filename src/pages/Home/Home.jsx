import { useState, useEffect, useRef } from "react";
import "./Home.scss";
import { useTheme } from "styled-components";
import HeroSection from "../../components/HeroSection/HeroSection";
import ProductsSection from "../../components/ProductsSection/ProductsSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";

const Home = () => {
  const theme = useTheme();
  return (
    <>
      <HeroSection theme={theme} />
      <div className="wrapper">
        <ProductsSection />
        <AboutSection />
        <TutorialSection />
      </div>
    </>
  );
};

export default Home;
