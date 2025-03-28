import React, { useEffect, useRef, useState } from "react";
import beigeLogo from "../../assets/images/icons/beige_logo.png";
import pinkLogo from "../../assets/images/icons/pink_logo.png";
import "./Navbar.scss";
import gsap from "gsap";
import { useTheme } from "styled-components";

const Navbar = () => {
  const logoRef = useRef(null);
  const leftLinksRef = useRef(null);
  const rightLinksRef = useRef(null);
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // GSAP Animation
    const tl = gsap.timeline();

    tl.fromTo(
      logoRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        leftLinksRef.current.children,
        { x: 0, opacity: 0 },
        {
          x: "-100px",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .fromTo(
        rightLinksRef.current.children,
        { x: 0, opacity: 0 },
        {
          x: "100px",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.8"
      );

    // Logo hover animation
    const logo = logoRef.current;

    const handleMouseEnter = () => {
      gsap.to(logo, {
        y: -5,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    logo.addEventListener("mouseenter", handleMouseEnter);
    logo.addEventListener("mouseleave", handleMouseLeave);

    // Scroll detection
    const onScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      logo.removeEventListener("mouseenter", handleMouseEnter);
      logo.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className="navbar"
      style={{
        fontFamily: theme.fonts.text,
        color: isScrolled ? theme.colors.pink : theme.colors.beige,
      }}
    >
      <div className="nav-links left" ref={leftLinksRef}>
        <a href="/">home</a>
        <a href="/shop">shop</a>
      </div>

      <img
        src={isScrolled ? pinkLogo : beigeLogo}
        alt="UMI Logo"
        className="logo"
        ref={logoRef}
      />

      <div className="nav-links right" ref={rightLinksRef}>
        <a href="/contact">contact</a>
        <a href="/about">about</a>
      </div>
    </nav>
  );
};

export default Navbar;
