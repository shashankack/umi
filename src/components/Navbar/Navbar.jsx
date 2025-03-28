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
  const prevScrollY = useRef(window.scrollY);
  const navVisible = useRef(true);
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const introTL = gsap.timeline({ paused: true });
    const outroTL = gsap.timeline({ paused: true });

    const navItems = [
      ...leftLinksRef.current.children,
      ...rightLinksRef.current.children,
    ];

    // Initial GSAP setup
    gsap.set(navItems, {
      opacity: 0,
      scale: 0.8,
    });
    gsap.set(logoRef.current, { y: -100, opacity: 0 });

    // Intro Animation
    introTL
      .to(logoRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      })
      .add("itemsIn", "-=0.5")
      .fromTo(
        leftLinksRef.current.children,
        { x: 0, opacity: 0 },
        {
          x: "-100px",
          stagger: 0.2,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "itemsIn"
      )
      .fromTo(
        rightLinksRef.current.children,
        { x: 0, opacity: 0 },
        {
          x: "100px",
          stagger: { each: 0.2, from: "end" },
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "itemsIn"
      );

    // Outro Animation
    outroTL
      .to(leftLinksRef.current.children, {
        x: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.in",
      })
      .to(
        rightLinksRef.current.children,
        {
          x: 0,
          opacity: 0,
          duration: 0.4,
          stagger: { each: 0.1, from: "start" },
          ease: "power2.in",
        },
        "<"
      )
      .to(
        logoRef.current,
        {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        },
        "+=0.1"
      );

    const SCROLL_THRESHOLD = 5;
    const currentScrollY = window.scrollY;
    prevScrollY.current = currentScrollY;

    if (currentScrollY > window.innerHeight) {
      // If already scrolled, go straight to outro state
      gsap.set(logoRef.current, { y: -100, opacity: 0 });
      gsap.set(leftLinksRef.current.children, { x: 0, opacity: 0 });
      gsap.set(rightLinksRef.current.children, { x: 0, opacity: 0 });
      navVisible.current = false;
      setIsScrolled(true);
    } else {
      // At top, play intro normally
      introTL.play();
      navVisible.current = true;
      setIsScrolled(false);
    }

    const handleScroll = () => {
      const newY = window.scrollY + 100;
      const delta = newY - prevScrollY.current;

      if (delta > SCROLL_THRESHOLD && navVisible.current) {
        outroTL.restart();
        navVisible.current = false;
      } else if (delta < -SCROLL_THRESHOLD && !navVisible.current) {
        introTL.restart();
        navVisible.current = true;
      }

      setIsScrolled(window.scrollY > window.innerHeight);
      prevScrollY.current = newY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar ${isScrolled ? "scrolled" : ""}`}
      style={{
        fontFamily: theme.fonts.text,
        color: isScrolled ? theme.colors.beige : theme.colors.pink,
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
