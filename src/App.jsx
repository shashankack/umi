import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ProductsInternal from "./components/Products/ProductsInternal";
import Contact from "./pages/Contact/Contact";
import Shop from "./pages/Shop/Shop";

import MobileNavbar from "./components/Navbar/MobileNavbar";
import { NavbarThemeProvider } from "./context/NavbarThemeContext";
import { CartProvider } from "./context/CartContext";
import CartUI from "./components/CartUi";
import Footer from "./components/Footer";
import Loader from "./components/Loader.jsx";
import FAQ from "./pages/FAQ.jsx";

import { createTheme, ThemeProvider } from "@mui/material";
import { faqData } from "./assets/faqData.jsx";
import Policies from "./pages/Policies";
import Intro from "./components/Intro.jsx";
import Test from "./components/Test.jsx";

import navbarBg from "./assets/images/navbar_bg.png";
import founder from "./assets/images/vectors/about/founder.png";
import desktopThumbnail from "./assets/images/desktop_thumbnail.png";
import mobileThumbnail from "./assets/images/mobile_thumbnail.png";

const theme = createTheme({
  colors: {
    pink: "#F6A09E",
    beige: "#FDF8CE",
    green: "#B5D782",
    white: "#FCF9E8",
  },
  fonts: {
    text: "Stolzl",
    heading: "Gliker",
    title: "Genty",
  },
});

const LoadingHandler = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
};

const App = () => {
  const isMobile = window.innerWidth <= 500;

  return (
    <NavbarThemeProvider>
      <img
        src={isMobile ? mobileThumbnail : desktopThumbnail}
        style={{
          display: "none",
        }}
      />
      <img
        src={navbarBg}
        style={{
          display: "none",
        }}
      />
      <img
        src={founder}
        style={{
          display: "none",
        }}
      />
      <ThemeProvider theme={theme}>
        <CartProvider>
          <Router basename="/" window={window}>
            <LoadingHandler>
              <MobileNavbar />
              <CartUI />
              <Routes>
                <Route path="/" element={<Intro NextComponent={Home} />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/product/:productId"
                  element={<ProductsInternal />}
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/terms-of-service" element={<Policies />} />
                <Route path="/privacy-policy" element={<Policies />} />
                <Route path="/refund-policy" element={<Policies />} />
                <Route path="/shipping-policy" element={<Policies />} />
                <Route path="/faq" element={<FAQ data={faqData} />} />
                <Route path="/test" element={<Test />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
              {location.pathname !== "/test" && <Footer />}
            </LoadingHandler>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </NavbarThemeProvider>
  );
};

export default App;
