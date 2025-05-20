import gsap from "gsap";
import { useNavbarTheme } from "../../context/NavbarThemeContext";
import { searchProducts, fetchShopifyProducts } from "../../utils/shopify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Input,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
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

const MobileNavbar = () => {
  const theme = useTheme();
  const { navbarTheme } = useNavbarTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [variantMenuOpen, setVariantMenuOpen] = useState(false);
  const [variants, setVariants] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const lastScrollTopRef = useRef(0);
  const tickingRef = useRef(false);
  const searchRef = useRef(null);

  const logo = navbarTheme === "pink" ? pinkLogo : beigeLogo;

  const navLinks = [
    { label: "Home", to: "/" },
    // { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Brewing", to: "/?scrollTo=brewing" },
    { label: "Our Matcha", to: "/?scrollTo=matcha" },
  ];

  const handleVariantMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setVariantMenuOpen(true);
  };
  const handleVariantMenuClose = () => {
    setAnchorEl(null);
    setVariantMenuOpen(false);
  };

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
      const list = data.flatMap((product) =>
        product.variants.edges.map((v) => ({
          title: product.title,
          variantId: v.node.id,
          productType: product.productType?.toLowerCase() || "matcha", // fallback
        }))
      );
      setVariants(list);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const lastScrollTop = lastScrollTopRef.current;

          if (currentScroll > lastScrollTop && currentScroll > 150) {
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
            onClick={() => (window.location.href = "/")}
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
                  <Box>
                    <Box
                      key={product.id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      py={0.5}
                      sx={{
                        width: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        (window.location.href = `/product/${product.id}`)
                      }
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
            width: isMobile ? "100vw" : "30vw",
            height: "101vh",
            borderRadius: 0,
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100vw" : "30vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 4,
            overflow: "hidden",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mt={-2}
            mb={2}
          >
            <Box
              width="100%"
              display="flex"
              justifyContent="start"
              alignItems="center"
              ml={-2}
            >
              <IconButton onClick={handleMenuToggle} size="large">
                <img src={CloseIcon} alt="Close" style={{ height: 35 }} />
              </IconButton>
            </Box>
            <Box
              component="img"
              src={beigeLogo}
              sx={{
                height: 100,
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
            {navLinks.map(({ label, to }) => (
              <ListItem
                key={label}
                disableGutters
                onClick={() => {
                  setIsMenuOpen(false); // close drawer first

                  setTimeout(() => {
                    navigate(to);
                  }, 300); // delay to allow close animation
                }}
                sx={{
                  textDecoration: "none",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      fontFamily={theme.fonts.heading}
                      fontSize="1.8rem"
                      fontWeight="bold"
                      color={theme.colors.beige}
                    >
                      {label}
                    </Typography>
                  }
                  sx={{ textAlign: "center" }}
                />
              </ListItem>
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
