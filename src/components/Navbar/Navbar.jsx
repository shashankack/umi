import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import beigeLogo from "../../assets/images/icons/beige_logo.png";
import pinkLogo from "../../assets/images/icons/pink_logo.png";
import { Box, Stack, useTheme } from "@mui/material";
import { useNavbarTheme } from "../../context/NavbarThemeContext";

import { HiShoppingCart } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const TestNavbar = () => {
  const logoRef = useRef(null);
  const leftLinksRef = useRef(null);
  const rightLinksRef = useRef(null);
  const prevScrollY = useRef(window.scrollY);
  const navVisible = useRef(true);
  const [isVisible, setIsVisible] = useState(true);
  const theme = useTheme();
  const { navbarTheme } = useNavbarTheme();
  const logo = navbarTheme === "pink" ? pinkLogo : beigeLogo;

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

    // Initial hidden state
    gsap.set(navItems, { opacity: 0, scale: 0.9 });
    gsap.set(logoRef.current, { y: -100, opacity: 0 });

    // Intro
    introTL
      .call(() => setIsVisible(true))
      .to(logoRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      })
      .add("itemsIn", "-=0.5")
      .to(
        leftLinksRef.current.children,
        {
          x: "-100px",
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "itemsIn"
      )
      .to(
        rightLinksRef.current.children,
        {
          x: "100px",
          opacity: 1,
          duration: 0.6,
          stagger: { each: 0.1, from: "end" },
          ease: "power3.out",
        },
        "itemsIn"
      );

    // Outro
    outroTL
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
          stagger: 0.1,
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
          ease: "power2.in",
          onComplete: () => setIsVisible(false),
        },
        ">0.1"
      );

    const SCROLL_THRESHOLD = 30;
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

          prevScrollY.current = newY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Play intro if user starts at top
    if (window.scrollY <= window.innerHeight) {
      introTL.play(0);
    } else {
      // Skip intro if already scrolled
      gsap.set(logoRef.current, { y: -100, opacity: 0 });
      gsap.set(leftLinksRef.current.children, { x: 0, opacity: 0 });
      gsap.set(rightLinksRef.current.children, { x: 0, opacity: 0 });
      navVisible.current = false;
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      introTL.kill();
      outroTL.kill();
    };
  }, []);

  return (
    <Box
      display={isVisible ? "flex" : "none"}
      justifyContent="center"
      alignItems="center"
      padding={2}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={1000}
      bgcolor="transparent"
    >
      <Box
        width={"100%"}
        display="flex"
        justifyContent="end"
        alignItems="center"
      >
        <Stack
          width={"100%"}
          ref={leftLinksRef}
          direction="row"
          spacing={4}
          fontSize={20}
          fontFamily="Stolzl"
          color="#FDF8CE"
          justifyContent={"end"}
          sx={{
            "& a": {
              padding: "2px 15px",
              borderRadius: "5px",
              boxShadow: `3px 3px 0 0 ${theme.colors.green}`,
              backgroundColor:
                navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige,
              textDecoration: "none",
              color:
                navbarTheme === "pink" ? theme.colors.beige : theme.colors.pink,
              transition: "color 0.3s ease",
              "&:hover": {
                color: theme.colors.green,
              },
            },
          }}
        >
          <a href="/">
            <FaUser />
          </a>
          <a href="/">home</a>
          <a href="/shop">shop</a>
        </Stack>
      </Box>

      <Box>
        <img
          ref={logoRef}
          src={logo}
          alt="logo"
          style={{ width: "130px", height: "auto", cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        />
      </Box>

      <Box
        width={"100%"}
        display="flex"
        justifyContent="start"
        alignItems="center"
      >
        <Stack
          ref={rightLinksRef}
          width={"100%"}
          direction="row"
          spacing={4}
          fontSize={20}
          fontFamily="Stolzl"
          color="#FDF8CE"
          justifyContent={"start"}
          sx={{
            "& a": {
              textDecoration: "none",
              padding: "2px 15px",
              borderRadius: "5px",
              boxShadow: `3px 3px 0 0 ${theme.colors.green}`,
              backgroundColor:
                navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige,
              color:
                navbarTheme === "pink" ? theme.colors.beige : theme.colors.pink,
              transition: "color 0.3s ease",
              "&:hover": {
                color: theme.colors.green,
              },
            },
          }}
        >
          <a href="/contact">contact</a>
          <a href="/about">about</a>
          <a href="/shop">
            <HiShoppingCart />
          </a>
        </Stack>
      </Box>
    </Box>
  );
};

export default TestNavbar;
