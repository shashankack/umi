import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ProductsInternal from "./components/Products/ProductsInternal";
import Contact from "./pages/Contact/Contact";
import { createTheme, ThemeProvider } from "@mui/material";
import Shop from "./pages/Shop/Shop";
import { useState } from "react";
import MobileNavbar from "./components/Navbar/MobileNavbar";

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
  },
});

const App = () => {
  const [isMobile] = useState(window.innerWidth <= 768 ? true : false);

  return (
    <ThemeProvider theme={theme}>
      <Router basename="/" window={window}>
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:productId" element={<ProductsInternal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
