import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Lazy-loaded components for code splitting
import { lazy, Suspense } from "react";

import Home from "./pages/Home/Home";
// const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const ProductsInternal = lazy(() =>
  import("./components/Products/ProductsInternal")
);
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));

import MobileNavbar from "./components/Navbar/MobileNavbar";
import { NavbarThemeProvider } from "./context/NavbarThemeContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import CartUI from "./components/CartUi";
import Footer from "./components/Footer";
import Loader from "./components/Loader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { createTheme, ThemeProvider } from "@mui/material";
import { faqData } from "./assets/faqData.jsx";
import Policies from "./pages/Policies";
import Intro from "./components/Intro.jsx";
import Test from "./components/Test.jsx";

import navbarBg from "./assets/images/navbar_bg.png";
import founder from "./assets/images/vectors/about/founder.png";
import desktopThumbnail from "./assets/images/desktop_thumbnail.png";
import mobileThumbnail from "./assets/images/mobile_thumbnail.png";
import Blogs from "./pages/Blogs.jsx";

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
      <ErrorBoundary>
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
          <ProductProvider>
            <CartProvider>
              <Router basename="/" window={window}>
                <LoadingHandler>
                  <MobileNavbar />
                  <CartUI />
                  <Routes>
                    <Route path="/" element={<Intro NextComponent={Home} />} />
                    <Route
                      path="/about"
                      element={
                        <Suspense fallback={<Loader />}>
                          <About />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/product/:productId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ProductsInternal />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Contact />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/shop"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Shop />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/blogs"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Blogs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/blogs/:blogId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <BlogPost />
                        </Suspense>
                      }
                    />
                    <Route path="/terms-of-service" element={<Policies />} />
                    <Route path="/privacy-policy" element={<Policies />} />
                    <Route path="/refund-policy" element={<Policies />} />
                    <Route path="/shipping-policy" element={<Policies />} />
                    <Route
                      path="/faq"
                      element={
                        <Suspense fallback={<Loader />}>
                          <FAQ data={faqData} />
                        </Suspense>
                      }
                    />
                    <Route path="/test" element={<Test />} />
                    <Route path="*" element={<div>Not Found</div>} />
                  </Routes>
                  {location.pathname !== "/test" && <Footer />}
                </LoadingHandler>
              </Router>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </NavbarThemeProvider>
  );
};

export default App;
