import React from "react";
import { useState, useEffect } from "react";

import pinkLogo from "../../assets/images/icons/pink_logo.png";
import beigeLogo from "../../assets/images/icons/beige_logo.png";
import "./SolidNavbar.scss";

const SolidNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <img src={beigeLogo} alt="" />
      </div>

      <ul className="nav-items">
        <li className="nav-item">
          <a href="#">Home</a>
        </li>
        <li className="nav-item">
          <a href="#">Products</a>
        </li>
        <li className="nav-item">
          <a href="#">About</a>
        </li>
        <li className="nav-item">
          <a href="#">Tutorials</a>
        </li>
      </ul>
    </nav>
  );
};

export default SolidNavbar;
