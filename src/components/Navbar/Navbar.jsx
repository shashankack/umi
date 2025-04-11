import React, { useEffect, useRef, useState } from "react";
import beigeLogo from "../../assets/images/icons/beige_logo.png";
import pinkLogo from "../../assets/images/icons/pink_logo.png";
import "./Navbar.scss";
import gsap from "gsap";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const logoRef = useRef(null);
  const leftLinksRef = useRef(null);
  const rightLinksRef = useRef(null);
  const prevScrollY = useRef(window.scrollY);
  const navVisible = useRef(true);
  const theme = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const nav = useNavigate();

  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRedirect = (e) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute("href");
    nav(target);
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const introTL = gsap.timeline({ paused: true });
    const outroTL = gsap.timeline({ paused: true });

    const navItems = [
      ...leftLinksRef.current.children,
      ...rightLinksRef.current.children,
    ];

    // Initial setup
    gsap.set(navItems, { opacity: 0, scale: 0.8 });
    gsap.set(logoRef.current, { y: -100, opacity: 0 });

    // Intro animation
    introTL
      .clear()
      .call(() => setIsVisible(true))
      .to(logoRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      })
      .add("itemsIn", "-=0.5")
      .to(
        leftLinksRef.current.children,
        {
          x: "-100px",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
        },
        "itemsIn"
      )
      .to(
        rightLinksRef.current.children,
        {
          x: "100px",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: { each: 0.2, from: "end" },
        },
        "itemsIn"
      );

    // Outro animation
    outroTL
      .clear()
      .to(
        leftLinksRef.current.children,
        {
          x: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.in",
        },
        0
      )
      .to(
        rightLinksRef.current.children,
        {
          x: 0,
          opacity: 0,
          duration: 0.4,
          stagger: { each: 0.1, from: "start" },
          ease: "power2.in",
        },
        0
      )
      .to(
        logoRef.current,
        {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => setIsVisible(false),
        },
        ">0.1"
      );

    // Setup scroll logic
    const SCROLL_THRESHOLD = 30;
    prevScrollY.current = window.scrollY;

    const alreadyScrolled = window.scrollY > window.innerHeight;

    if (alreadyScrolled) {
      // Skip animation, directly set final OUTRO state
      gsap.set(logoRef.current, { y: -100, opacity: 0 });
      gsap.set(leftLinksRef.current.children, { x: 0, opacity: 0 });
      gsap.set(rightLinksRef.current.children, { x: 0, opacity: 0 });
      navVisible.current = false;
      setIsScrolled(true);
    } else {
      // Ensure everything starts invisible for intro
      gsap.set(logoRef.current, { y: -100, opacity: 0 });
      gsap.set(leftLinksRef.current.children, { x: 0, opacity: 0 });
      gsap.set(rightLinksRef.current.children, { x: 0, opacity: 0 });
      introTL.play(0);
      navVisible.current = true;
      setIsScrolled(false);
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newY = window.scrollY;
          const delta = newY - prevScrollY.current;

          if (
            delta > SCROLL_THRESHOLD &&
            navVisible.current &&
            !outroTL.isActive()
          ) {
            outroTL.restart(true);
            navVisible.current = false;
          } else if (
            delta < -SCROLL_THRESHOLD &&
            !navVisible.current &&
            !introTL.isActive()
          ) {
            introTL.restart(true);
            navVisible.current = true;
          }

          setIsScrolled(newY > window.innerHeight);
          prevScrollY.current = newY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      introTL.kill();
      outroTL.kill();
    };
  }, []);

  return (
    <>
      <nav
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        style={{
          display: isVisible ? "flex" : "none",
          fontFamily: theme.fonts.text,
          color: isScrolled ? theme.colors.beige : theme.colors.pink,
        }}
      >
        <div className="nav-links left" ref={leftLinksRef}>
          <a href="/">home</a>
          <a href="#shop" onClick={handleSmoothScroll}>
            shop
          </a>
        </div>

        <img
          src={isScrolled ? pinkLogo : beigeLogo}
          alt="UMI Logo"
          className="logo"
          onClick={() => (window.location.href = "/")}
          ref={logoRef}
        />

        <div className="nav-links right" ref={rightLinksRef}>
          <a href="/contact">contact</a>
          <a href="/about">about</a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
