import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load all page components for consistent loading experience
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const ProductsInternal = lazy(() =>
  import("./components/Products/ProductsInternal")
);
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const SearchPage = lazy(() => import("./pages/SearchPage.jsx"));
const AboutMatcha = lazy(() => import("./pages/AboutMatcha.jsx"));
const Policies = lazy(() => import("./pages/Policies"));
const Intro = lazy(() => import("./components/Intro.jsx"));
const Blogs = lazy(() => import("./pages/Blogs.jsx"));
const Brewing = lazy(() => import("./pages/Brewing.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

import Navbar from "./components/Navbar";
import { NavbarThemeProvider } from "./context/NavbarThemeContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import CartUI from "./components/CartUi";

import Loader from "./components/Loader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { createTheme, ThemeProvider } from "@mui/material";
import { faqData } from "./assets/faqData.jsx";

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

      <Navbar />
      <CartUI />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Intro NextComponent={Home} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:productName" element={<ProductsInternal />} />
          <Route path="/search" element={<SearchPage />} />
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
      </Suspense>
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
                <AppContent />
              </Router>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </NavbarThemeProvider>
  );
};

export default App;
