// src/components/Navbar.jsx
import gsap from "gsap";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { fetchShopifyProducts } from "../utils/shopify";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Collapse,
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  useTheme,
  Divider,
  useMediaQuery,
  Link as MUILink,
} from "@mui/material";

import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// BRAND ASSETS (unchanged – keep your paths)
import navbarBg from "../assets/images/navbar_bg.png";
import beigeMenu from "../assets/images/icons/beige_menu.png";
import pinkMenu from "../assets/images/icons/pink_menu.png";
import CloseIcon from "../assets/images/icons/close_icon.png";
import neko from "../assets/images/vectors/neko/neko.gif";
import beigeLogo from "../assets/images/icons/beige_logo.png";
import pinkLogo from "../assets/images/icons/pink_logo.png";
import dropDown from "../assets/images/vectors/dropdown_icon.png";

// NEW: the dialog search
import SearchUI from "./SearchUi";

const Navbar = () => {
  const theme = useTheme();
  const { navbarTheme } = useNavbarTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showShopSubmenu, setShowShopSubmenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // NEW: dialog search control
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const lastScrollTopRef = useRef(0);
  const tickingRef = useRef(false);
  const pendingRouteRef = useRef(null); // route to navigate after Drawer closes

  const logo = navbarTheme === "pink" ? pinkLogo : beigeLogo;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop", hasDropdown: true },
    { label: "About", to: "/about" },
    { label: "Brewing", to: "/how-to-make-matcha-at-home" },
    { label: "Our Matcha", to: "/our-matcha" },
    { label: "Contact", to: "/contact" },
    { label: "Blogs", to: "/blogs" },
  ];

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  // Animate logo a touch when search/dialog toggles so it feels alive
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.to(".navbar-logo", {
      scale: isSearchOpen ? 0.98 : 1,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const data = await fetchShopifyProducts();
        const categories = data.reduce((acc, product) => {
          const { productType } = product || {};
          if (!productType) return acc;
          if (!acc[productType]) acc[productType] = [];
          acc[productType].push(product);
          return acc;
        }, {});
        setCategoriesMap(categories);
      } catch (e) {
        console.error("Failed to fetch products for categories:", e);
      }
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const threshold = pathname === "/" ? 600 : 100;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const lastScrollTop = lastScrollTopRef.current;

          if (currentScroll > lastScrollTop && currentScroll > threshold) {
            setIsNavbarVisible(false);
          } else {
            setIsNavbarVisible(true);
          }

          lastScrollTopRef.current = currentScroll;
          tickingRef.current = false;
        });

        tickingRef.current = true;
      }
    };

    fetchVariants();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once

  const [categoriesMap, setCategoriesMap] = useState({});

  // Helpers for Drawer link behavior:
  // - Keep standard link features (open in new tab) if user uses modifier keys/middle click
  // - Otherwise, prevent default, close Drawer, then navigate on onExited
  const isModifiedEvent = (e) =>
    e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button === 1;

  const handleSmartNav = useCallback((e, to) => {
    if (!to) return;
    if (isModifiedEvent(e)) return; // allow default (new tab/window)
    e.preventDefault();
    pendingRouteRef.current = to;
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      {/* SEARCH DIALOG */}
      <SearchUI open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          transition: "all 0.4s ease",
          py: 2,
          transform: isNavbarVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: isNavbarVisible ? 1 : 0,
          pointerEvents: isNavbarVisible ? "auto" : "none",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Box width="100%">
            <IconButton
              edge="end"
              onClick={handleMenuToggle}
              size="large"
              aria-label="Open menu"
            >
              <img
                src={navbarTheme === "pink" ? pinkMenu : beigeMenu}
                alt="Menu"
                style={{ height: 25 }}
              />
            </IconButton>
          </Box>

          {/* Logo as RouterLink (SPA, supports open-in-new-tab) */}
          <Box
            component={RouterLink}
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="navbar-logo"
            sx={{
              height: isMobile ? 70 : 100,
              display: "inline-flex",
              alignItems: "center",
              transform: isMenuOpen ? "scale(0)" : "scale(1)",
              filter: isMenuOpen ? "brightness(.5)" : "none",
              transition: "all .3s ease",
              "&:hover": { cursor: "pointer", transform: "scale(1.05)" },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: "100%", display: "block" }}
            />
          </Box>

          {/* Right controls: Search icon */}
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="end"
            alignItems="center"
            position="relative"
          >
            <IconButton
              onClick={() => setIsSearchOpen(true)}
              size="small"
              aria-label="Open search"
            >
              <FaSearch
                fontSize={30}
                color={
                  navbarTheme === "pink"
                    ? theme.colors.pink
                    : theme.colors.beige
                }
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={handleMenuToggle}
        SlideProps={{
          onExited: () => {
            if (pendingRouteRef.current) {
              navigate(pendingRouteRef.current);
              pendingRouteRef.current = null;
              window.scrollTo(0, 0);
            }
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundImage: `url(${navbarBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: isMobile ? "103vw" : "30vw",
            ml: -1,
            height: "101vh",
            borderRadius: 0,
            boxShadow: "none",
          },
        }}
      >
        <Box
          borderColor={theme.colors.green}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            overflow: "hidden",
          }}
        >
          <Box
            borderColor={theme.colors.green}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mt={-1}
            mb={2}
          >
            <Box
              width="100%"
              display="flex"
              justifyContent="start"
              alignItems="center"
            >
              <IconButton
                onClick={handleMenuToggle}
                size="large"
                aria-label="Close menu"
              >
                <img src={CloseIcon} alt="Close" style={{ height: 35 }} />
              </IconButton>
            </Box>

            {/* Drawer logo as RouterLink (use smart close+navigate) */}
            <Box
              component={RouterLink}
              to="/"
              onClick={(e) => handleSmartNav(e, "/")}
              underline="none"
              sx={{
                height: isMobile ? 70 : 100,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
              aria-label="Go to Home"
            >
              <Box
                component="img"
                src={beigeLogo}
                alt="Logo"
                sx={{ height: "100%" }}
              />
            </Box>

            <Box
              width="100%"
              display="flex"
              justifyContent="end"
              alignItems="center"
            />
          </Box>

          <List
            sx={{
              width: "100%",
              textAlign: "center",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {navLinks.map(({ label, to, hasDropdown }) => (
              <Box key={label} width="100%">
                <ListItem
                  disableGutters
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: 0,
                    py: 0.2,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    width="100%"
                  >
                    {/* Label is a link that navigates; caret toggles dropdown */}
                    <MUILink
                      component={RouterLink}
                      to={to}
                      onClick={(e) => handleSmartNav(e, to)}
                      underline="none"
                      sx={{ cursor: "pointer" }}
                      aria-label={`Go to ${label}`}
                    >
                      <Typography
                        component="span"
                        fontFamily={theme.fonts.heading}
                        fontSize="1.8rem"
                        fontWeight="bold"
                        color={theme.colors.beige}
                        sx={{ userSelect: "none" }}
                      >
                        {label}
                      </Typography>
                    </MUILink>

                    {hasDropdown && (
                      <IconButton
                        aria-label="Toggle Shop submenu"
                        aria-expanded={showShopSubmenu}
                        aria-controls="shop-submenu"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShopSubmenu((prev) => !prev);
                        }}
                        sx={{ p: 0.5, mr: -1 }}
                      >
                        <Box
                          component="img"
                          src={dropDown}
                          alt=""
                          sx={{
                            width: 20,
                            height: 20,
                            transformOrigin: "center",
                            transform: showShopSubmenu
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>

                  {/* Collapsible Shop submenu */}
                  {label === "Shop" && (
                    <Collapse in={showShopSubmenu} timeout="auto" unmountOnExit>
                      <Box
                        id="shop-submenu"
                        mt={1}
                        width="100%"
                        textAlign="center"
                      >
                        {Object.keys(categoriesMap).map((cat) => {
                          const toObj = {
                            pathname: "/shop",
                            search: `?scrollTo=${encodeURIComponent(cat)}`,
                          };
                          return (
                            <MUILink
                              key={cat}
                              component={RouterLink}
                              to={toObj}
                              onClick={(e) => handleSmartNav(e, toObj)}
                              underline="none"
                              sx={{ textDecoration: "none" }}
                              aria-label={`Go to ${cat} category`}
                            >
                              <Typography
                                component="span"
                                fontFamily={theme.fonts.heading}
                                fontSize="1.4rem"
                                textTransform={"capitalize"}
                                fontWeight="bold"
                                color={theme.colors.beige}
                                sx={{
                                  display: "block",
                                  py: 0.5,
                                  cursor: "pointer",
                                  borderBottom: `1px solid ${theme.colors.green}`,
                                  "&:first-of-type": {
                                    borderTop: `1px solid ${theme.colors.green}`,
                                  },
                                }}
                              >
                                {cat}
                              </Typography>
                            </MUILink>
                          );
                        })}
                      </Box>
                    </Collapse>
                  )}
                </ListItem>
              </Box>
            ))}
          </List>

          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 150,
              mb: 10,
            }}
          >
            <img
              src={neko}
              alt="Drawer Illustration"
              style={{ width: "100%", maxWidth: 150 }}
              loading="lazy"
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
