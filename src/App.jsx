import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    pink: "#F6A09E",
    beige: "#FDF8CE",
    green: "#B5D782",
  },

  fonts: {
    text: "Stolzl",
    heading: "Gliker",
  },
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
