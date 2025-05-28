import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Hero from "./components/HeroSection.jsx";

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

import { createTheme, ThemeProvider } from "@mui/material";
import Test from "./components/Test.jsx";
import Policies from "./pages/Policies";

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

// This component handles showing the Loader on route change
const LoadingHandler = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When location changes, show loading
    setLoading(true);

    // Hide loading after 300ms - adjust as needed
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
  return (
    <NavbarThemeProvider>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <Router basename="/" window={window}>
            <LoadingHandler>
              <MobileNavbar />
              <CartUI />
              <Routes>
                <Route path="/" element={<Home />} />
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
                <Route path="/load" element={<Hero />} />
              </Routes>
              <Footer />
            </LoadingHandler>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </NavbarThemeProvider>
  );
};

export default App;
