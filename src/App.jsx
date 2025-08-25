import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const ProductsInternal = lazy(() =>
  import("./components/Products/ProductsInternal")
);
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));

import AboutMatcha from "./pages/AboutMatcha.jsx";
import MobileNavbar from "./components/Navbar/MobileNavbar";
import { NavbarThemeProvider } from "./context/NavbarThemeContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import CartUI from "./components/CartUi";

import Loader from "./components/Loader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { createTheme, ThemeProvider } from "@mui/material";
import { faqData } from "./assets/faqData.jsx";
import Policies from "./pages/Policies";
import Intro from "./components/Intro.jsx";
import Blogs from "./pages/Blogs.jsx";
import ProductsSectionNew from "./components/Products/ProductsSectionNew.jsx";
import Brewing from "./pages/Brewing.jsx";

import navbarBg from "./assets/images/navbar_bg.png";
import founder from "./assets/images/vectors/about/founder.png";
import desktopThumbnail from "./assets/images/desktop_thumbnail.png";
import mobileThumbnail from "./assets/images/mobile_thumbnail.png";
import NotFound from "./pages/NotFound.jsx";

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

const AppContent = () => {
  const isMobile = window.innerWidth <= 500;

  return (
    <>
      {/* Preload assets */}
      <img
        src={isMobile ? mobileThumbnail : desktopThumbnail}
        style={{ display: "none" }}
      />
      <img src={navbarBg} style={{ display: "none" }} />
      <img src={founder} style={{ display: "none" }} />

      <MobileNavbar />
      <CartUI />
      <Routes>
        <Route path="/" element={<Intro NextComponent={Home} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productName" element={<ProductsInternal />} />
        <Route path="/our-matcha" element={<AboutMatcha />} />
        <Route path="/how-to-make-matcha-at-home" element={<Brewing />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:blogId" element={<BlogPost />} />
        <Route path="/terms-of-service" element={<Policies />} />
        <Route path="/privacy-policy" element={<Policies />} />
        <Route path="/refund-policy" element={<Policies />} />
        <Route path="/shipping-policy" element={<Policies />} />
        <Route path="/faq" element={<FAQ data={faqData} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <NavbarThemeProvider>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <ProductProvider>
            <CartProvider>
              <Router basename="/">
                <Suspense fallback={<Loader />}>
                  <AppContent />
                </Suspense>
              </Router>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </NavbarThemeProvider>
  );
};

export default App;
