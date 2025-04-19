import "./Home.scss";
import { useTheme } from "@mui/material/styles";
import HeroSection from "../../components/HeroSection/HeroSection";
import ProductsSection from "../../components/Products/ProductsSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import TutorialSection from "../../components/TutorialSection/TutorialSection";

import CurvedMarquee from "../../components/CurvedMarquee/CurvedMarquee";

const Home = () => {
  const theme = useTheme();
  return (
    <>
      <HeroSection theme={theme} />
      <div className="products-sec" style={{ position: "relative" }}>
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
      <div className="about-sec">
        <AboutSection />
      </div>
      <TutorialSection />
    </>
  );
};

export default Home;
