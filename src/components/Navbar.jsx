import gsap from "gsap";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { searchProducts, fetchShopifyProducts } from "../utils/shopify";
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
  Input,
  Divider,
  useMediaQuery,
  Link as MUILink, // MUI Link, rendered as RouterLink for SPA anchors
} from "@mui/material";

import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import navbarBg from "../assets/images/navbar_bg.png";
import beigeMenu from "../assets/images/icons/beige_menu.png";
import pinkMenu from "../assets/images/icons/pink_menu.png";
import CloseIcon from "../assets/images/icons/close_icon.png";
import neko from "../assets/images/vectors/neko/neko.gif";
import beigeLogo from "../assets/images/icons/beige_logo.png";
import pinkLogo from "../assets/images/icons/pink_logo.png";
import dropDown from "../assets/images/vectors/dropdown_icon.png";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});

  const lastScrollTopRef = useRef(0);
  const tickingRef = useRef(false);
  const searchRef = useRef(null);
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

  // Animate search field open/close, keep it mounted to preserve focus
  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
    if (!searchRef.current || typeof window === "undefined") return;
    gsap.to(searchRef.current, {
      width: isSearchOpen ? 0 : 300,
      opacity: isSearchOpen ? 0 : 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Debounced search (ignore late results)
  useEffect(() => {
    let alive = true;
    if (searchValue.trim().length <= 1) {
      setFilteredProducts([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const list = await searchProducts(searchValue.trim());
        if (!alive) return;
        setFilteredProducts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) console.error(e);
      }
    }, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [searchValue]);

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

  const goToProductHref = (product) =>
    `/product/${product?.handle || product?.id || ""}`;

  return (
    <>
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

          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="end"
            alignItems="center"
            position="relative"
          >
            <Box position="relative" zIndex={30}>
              {isSearchOpen ? (
                <IconButton
                  onClick={handleSearchToggle}
                  size="small"
                  aria-label="Close search"
                >
                  <IoClose fontSize={30} color={theme.colors.pink} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleSearchToggle}
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
              )}
            </Box>

            {/* Search input stays mounted; GSAP controls width/opacity */}
            <Box position="absolute" right={0}>
              <Input
                inputRef={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                disableUnderline
                aria-label="Search products"
                sx={{
                  width: 0,
                  opacity: 0,
                  pointerEvents: isSearchOpen ? "auto" : "none",
                  right: 0,
                  backgroundColor: theme.colors.beige,
                  color: theme.colors.pink,
                  borderRadius: 2,
                  border: `2px solid ${theme.colors.green}`,
                  padding: "0 12px",
                  "&.Mui-focused": { borderColor: theme.colors.pink },
                }}
              />
            </Box>

            {/* Results popover */}
            <Box
              role="listbox"
              aria-label="Search results"
              maxHeight={200}
              overflow="auto"
              position="absolute"
              top={40}
              right={0}
              width={300}
              borderRadius={2}
              sx={{
                border: isSearchOpen
                  ? `2px solid ${theme.colors.green}`
                  : "none",
              }}
              bgcolor={theme.colors.beige}
            >
              {isSearchOpen &&
                filteredProducts.map((product) => {
                  const to = goToProductHref(product);
                  return (
                    <Box key={product.id || product.handle}>
                      <Box
                        component={RouterLink}
                        to={to}
                        onClick={() => setIsMenuOpen(false)}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        py={0.5}
                        role="option"
                        aria-label={product.title}
                        sx={{
                          width: "100%",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                        }}
                      >
                        {product.image && (
                          <Box bgcolor={theme.colors.beige} borderRadius={2}>
                            <img
                              src={product.image}
                              alt={product.title}
                              width={50}
                              height={50}
                              style={{ borderRadius: 4, objectFit: "cover" }}
                              loading="lazy"
                            />
                          </Box>
                        )}
                        <Typography
                          fontSize="12px"
                          fontFamily={"Stolzl"}
                          color={theme.colors.pink}
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": { letterSpacing: "0.5px" },
                          }}
                        >
                          {product.title}
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          width: "100%",
                          border: `1.2px solid ${theme.colors.green}`,
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  );
                })}
            </Box>
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
