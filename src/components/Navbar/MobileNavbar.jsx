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
} from "@mui/material";

import MenuIcon from "../../assets/images/icons/menu_icon.png";
import CloseIcon from "../../assets/images/icons/close_icon.png";
import menuIllustration from "../../assets/images/menu_illustration.png";

import beigeCloud from "../../assets/images/icons/beige_logo.png";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const tickingRef = useRef(false);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const lastScrollTop = lastScrollTopRef.current;

          if (currentScroll > lastScrollTop && currentScroll > 150) {
            setIsNavbarVisible(false); // Scroll down → hide
          } else {
            setIsNavbarVisible(true); // Scroll up → show
          }

          lastScrollTopRef.current = currentScroll;
          tickingRef.current = false;
        });

        tickingRef.current = true;
      }
    };

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
          p: 2,
          transform: isNavbarVisible ? "opacity(0%)" : "opacity(100%)",
          opacity: isNavbarVisible ? 1 : 0,
          pointerEvents: isNavbarVisible ? "auto" : "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
          <Box
            width="100%"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={beigeCloud}
              alt="Logo"
              style={{
                height: 100,
                transform: isMenuOpen ? "scale(0.5)" : "scale(1)",
                filter: isMenuOpen ? "brightness(.5)" : "none",
                transition: "all .5s ease",
              }}
              onClick={() => (window.location.href = "/")}
            />
          </Box>

          <Box sx={{ marginLeft: "auto", position: "absolute", right: 20 }}>
            <IconButton edge="end" onClick={handleMenuToggle} size="large">
              <img src={MenuIcon} alt="Menu" style={{ height: 30 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={isMenuOpen} onClose={handleMenuToggle}>
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            backgroundColor: theme.colors.green,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 4,
          }}
        >
          {/* Top Section: Logo & Close Button */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img src={beigeCloud} alt="Logo" style={{ height: 100 }} />
          </Box>
          <IconButton
            onClick={handleMenuToggle}
            size="large"
            sx={{ position: "absolute", right: 20 }}
          >
            <img src={CloseIcon} alt="Close" style={{ height: 34 }} />
          </IconButton>

          {/* Navigation Links */}
          <List
            sx={{
              width: "100%",
              textAlign: "center",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textShadow: `1.698px 1.698px 0px #F6A09E`,
            }}
          >
            {[
              { label: "Home", to: "/" },
              { label: "Shop", to: "/shop" },
              { label: "Contact", to: "/contact" },
              { label: "About", to: "/about" },
              { label: "Brewing", to: "/brewing" },
            ].map(({ label, to }) => (
              <ListItem
                key={label}
                disableGutters
                onClick={handleMenuToggle}
                component={"a"}
                href={to}
                sx={{
                  textDecoration: "none",
                  justifyContent: "center",
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

          {/* Bottom Illustration Section */}
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={menuIllustration}
              alt="Drawer Illustration"
              style={{ width: "100%", maxWidth: 300 }}
            />
            <Typography
              fontSize="0.75rem"
              color={theme.colors.beige}
              fontFamily={theme.fonts.heading}
            >
              Life comes in waves. Match(a) your flow.
              <br />
              By matcha lovers, for matcha lovers.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
