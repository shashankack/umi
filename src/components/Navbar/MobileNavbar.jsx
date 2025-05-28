import gsap from "gsap";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { searchProducts, fetchShopifyProducts } from "../../utils/shopify";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
} from "@mui/material";

import { FaSearch, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import navbarBg from "../../assets/images/navbar_bg.png";
import beigeMenu from "../../assets/images/icons/beige_menu.png";
import pinkMenu from "../../assets/images/icons/pink_menu.png";
import CloseIcon from "../../assets/images/icons/close_icon.png";
import neko from "../../assets/images/vectors/neko/neko.gif";
import beigeLogo from "../../assets/images/icons/beige_logo.png";
import pinkLogo from "../../assets/images/icons/pink_logo.png";
import dropDown from "../../assets/images/vectors/dropdown_icon.png";

const MobileNavbar = () => {
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

  const logo = navbarTheme === "pink" ? pinkLogo : beigeLogo;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop", hasDropdown: true },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Brewing", to: "/?scrollTo=brewing" },
    { label: "Our Matcha", to: "/?scrollTo=ourmatcha" },
  ];

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);

    if (!isSearchOpen) {
      gsap.to(searchRef.current, { width: "300px", opacity: 1, duration: 0.5 });
    } else {
      gsap.to(searchRef.current, { width: "0", opacity: 0, duration: 0.5 });
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.length > 1) {
        searchProducts(searchValue).then(setFilteredProducts);
      } else {
        setFilteredProducts([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);

  useEffect(() => {
    const fetchVariants = async () => {
      const data = await fetchShopifyProducts();

      const categories = data.reduce((acc, product) => {
        const { productType } = product;
        if (!acc[productType]) acc[productType] = [];
        acc[productType].push(product);
        return acc;
      }, {});
      setCategoriesMap(categories);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const threshold = pathname === "/" ? 1000 : 100;

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
  }, []);

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
            <IconButton edge="end" onClick={handleMenuToggle} size="large">
              <img
                src={navbarTheme === "pink" ? pinkMenu : beigeMenu}
                alt="Menu"
                style={{ height: 25 }}
              />
            </IconButton>
          </Box>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: isMobile ? 70 : 100,
              transform: isMenuOpen ? "scale(0)" : "scale(1)",
              filter: isMenuOpen ? "brightness(.5)" : "none",
              transition: "all .3s ease",

              "&:hover": {
                cursor: "pointer",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => {
              setIsMenuOpen(false);
              window.location.href = "/";
            }}
          />
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
                <IconButton onClick={handleSearchToggle} size="small">
                  <IoClose
                    fontSize={30}
                    color={
                      navbarTheme === "pink"
                        ? theme.colors.beige
                        : theme.colors.pink
                    }
                  />
                </IconButton>
              ) : (
                <IconButton onClick={handleSearchToggle} size="small">
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

            <Box position="absolute" right={0}>
              <Input
                ref={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                disableUnderline
                sx={{
                  display: isSearchOpen ? "block" : "none",
                  right: 0,
                  backgroundColor:
                    navbarTheme === "pink"
                      ? theme.colors.pink
                      : theme.colors.beige,
                  color:
                    navbarTheme === "pink"
                      ? theme.colors.beige
                      : theme.colors.pink,
                  borderRadius: 2,
                  border: `2px solid ${theme.colors.green}`,
                  padding: "0 12px",
                  "&.Mui-focused": {
                    borderColor:
                      navbarTheme === "pink"
                        ? theme.colors.beige
                        : theme.colors.pink,
                  },
                }}
              />
            </Box>
            <Box
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
              bgcolor={
                navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige
              }
            >
              {isSearchOpen &&
                filteredProducts.map((product) => (
                  <Box key={product.id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={0.5}
                      sx={{
                        width: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(
                          () => navigate(`/product/${product.id}`),
                          300
                        );
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
                          />
                        </Box>
                      )}
                      <Typography
                        fontSize="12px"
                        fontFamily={"Stolzl"}
                        color={
                          navbarTheme === "pink"
                            ? theme.colors.beige
                            : theme.colors.pink
                        }
                        sx={{
                          transition: "all 0.3s ease",

                          "&:hover": {
                            letterSpacing: "0.5px",
                          },
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
                ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={handleMenuToggle}
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
              <IconButton onClick={handleMenuToggle} size="large">
                <img src={CloseIcon} alt="Close" style={{ height: 35 }} />
              </IconButton>
            </Box>
            <Box
              onClick={() => {
                setIsMenuOpen(false);
                setTimeout(() => navigate("/"), 300);
              }}
              component="img"
              src={beigeLogo}
              sx={{
                height: isMobile ? 70 : 100,
              }}
            />
            <Box
              width="100%"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <FaUser fontSize={30} color={theme.colors.beige} />
            </Box>
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
                    py: 1,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    width="100%"
                  >
                    <Typography
                      fontFamily={theme.fonts.heading}
                      fontSize="1.8rem"
                      fontWeight="bold"
                      color={theme.colors.beige}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => {
                          if (label === "Brewing" || label === "Our Matcha") {
                            navigate(
                              `/?scrollTo=${label
                                .toLowerCase()
                                .replace(/\s/g, "")}`
                            );
                          } else {
                            navigate(to);
                          }
                        }, 300);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      {label}
                    </Typography>

                    {hasDropdown && (
                      <Box
                        component="img"
                        src={dropDown}
                        alt="▼"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering nav
                          setShowShopSubmenu((prev) => !prev);
                        }}
                        sx={{
                          width: 20,
                          height: 20,
                          transformOrigin: "center",
                          mr: -4,
                          transform: showShopSubmenu
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </Box>

                  {/* Collapsible Shop submenu */}
                  {label === "Shop" && (
                    <Collapse in={showShopSubmenu} timeout="auto" unmountOnExit>
                      <Box mt={1} width="100%" textAlign="center">
                        {Object.keys(categoriesMap).map((cat) => (
                          <Typography
                            key={cat}
                            onClick={() => {
                              setShowShopSubmenu(false);
                              setIsMenuOpen(false);
                              setTimeout(() => {
                                navigate(`/shop?scrollTo=${cat}`);
                              }, 300);
                            }}
                            fontFamily={theme.fonts.heading}
                            fontSize="1.4rem"
                            textTransform={"capitalize"}
                            fontWeight="bold"
                            color={theme.colors.beige}
                            sx={{
                              py: 0.5,
                              cursor: "pointer",
                              // borderTop: `1px solid ${theme.colors.green}`,
                              borderBottom: `1px solid ${theme.colors.green}`,
                              "&:first-child": {
                                borderTop: `1px solid ${theme.colors.green}`,
                              },
                              "&:last-child": {
                                borderBottom: `1px solid ${theme.colors.green}`,
                              },
                            }}
                          >
                            {cat}
                          </Typography>
                        ))}
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
              width: 140,
            }}
          >
            <img
              src={neko}
              alt="Drawer Illustration"
              style={{ width: "100%", maxWidth: 150 }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
