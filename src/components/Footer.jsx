import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Link,
} from "@mui/material";

import { FaPinterestP } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

import bowl from "../assets/images/vectors/footer/bowl.png";
import whisk from "../assets/images/vectors/footer/whisk.png";
import copyright from "../assets/images/vectors/footer/copyright.png";

import pinkMonogram from "../assets/images/icons/pink_monogram.png";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navLinkStyles = {
    textDecoration: "none",
    color: theme.colors.pink,
    fontFamily: theme.fonts.text,
    fontSize: isMobile ? "2.4vw" : "1.2vw",
    transition: "all 0.3s ease",

    "&:hover": {
      cursor: "pointer",
      color: theme.colors.green,
      transform: "scale(1.05)",
    },
  };

  const iconStyles = {
    textDecoration: "none",
    mr: "1vw",
    "&:last-child": {
      mr: 0,
    },
    color: theme.colors.beige,
    bgcolor: theme.colors.green,
    fontFamily: theme.fonts.text,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile ? "4.2vw" : "2.6vw",
    height: isMobile ? "4.2vw" : "2.6vw",
    transition: "all 0.3s ease",

    "&:hover": {
      cursor: "pointer",
      bgcolor: theme.colors.pink,
      transform: "scale(1.1) rotate(-20deg)",
    },
  };

  const navLinks = [
    [
      { name: "FAQ", path: "/faq" },
      { name: "Shop", path: "/shop" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Our matcha", path: "/?scrollTo=ourmatcha" },
    ],
    [
      { name: "Terms of service", path: "/terms-of-service" },
      { name: "Refund policy", path: "/refund-policy" },
      { name: "Privacy policy", path: "/privacy-policy" },
      { name: "Shipping policy", path: "/shipping-policy" },
    ],
    [
      { name: "Instagram", path: "https://www.instagram.com/umimatchaclub" },
      { name: "Pinterest", path: "https://pin.it/5YQInpBIg" },
      { name: "WhatsApp", path: "https://wa.me/9568480048" },
    ],
  ];

  return (
    <Stack
      zIndex={500}
      direction="row"
      bgcolor={theme.colors.beige}
      overflow="hidden"
      justifyContent="space-around"
      position="relative"
      py={isMobile ? 3 : 6}
      px={isMobile ? 0 : 6}
    >
      <Stack direction="column" alignItems="center" gap={isMobile ? 2 : 4}>
        <Box width={isMobile ? "15vw" : "8vw"}>
          <Box
            component="img"
            src={pinkMonogram}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "all 0.3s ease",
              "&:hover": {
                cursor: "pointer",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => (window.location.href = "/")}
          />
        </Box>
        <Box width={isMobile ? "15vw" : "8vw"}>
          <Box
            component="img"
            src={bowl}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          fontSize={isMobile ? "2.3vw" : "1.2vw"}
          fontFamily={theme.fonts.text}
          fontWeight={500}
          color={theme.colors.pink}
          textAlign="center"
        >
          Kinder rituals that <br />
          fill your cup
        </Typography>
      </Stack>
      <Stack justifyContent="space-between">
        <Stack gap={isMobile ? 0.5 : 2}>
          {navLinks[0].map((linkGroup, index) => (
            <Link
              key={index}
              sx={navLinkStyles}
              onClick={() => {
                setTimeout(() => {
                  if (linkGroup.name === "Our Matcha") {
                    navigate("/?scrollTo=ourmatcha");
                  } else {
                    window.location.href = linkGroup.path;
                  }
                }, 300);
              }}
            >
              {linkGroup.name}
            </Link>
          ))}
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          {navLinks[2].map((linkGroup, index) => (
            <Link
              key={index}
              sx={iconStyles}
              href={linkGroup.path}
              target="_blank"
            >
              {linkGroup.name === "Instagram" && (
                <FaInstagram size={isMobile ? 14 : "1.7vw"} />
              )}
              {linkGroup.name === "Pinterest" && (
                <FaPinterestP size={isMobile ? 14 : "1.7vw"} />
              )}
              {linkGroup.name === "WhatsApp" && (
                <FaWhatsapp size={isMobile ? 14 : "1.7vw"} />
              )}
            </Link>
          ))}
        </Stack>
      </Stack>
      <Stack justifyContent="space-between" alignItems="baseline">
        <Stack gap={isMobile ? 0.5 : 2}>
          {navLinks[1].map((linkGroup, index) => (
            <Link key={index} sx={navLinkStyles} href={linkGroup.path}>
              {linkGroup.name}
            </Link>
          ))}
        </Stack>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="end"
          width={isMobile ? "16vw" : "6vw"}
        >
          <Box
            component="img"
            src={whisk}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Typography
          sx={{
            color: theme.colors.pink,
            fontFamily: theme.fonts.text,
            fontSize: isMobile ? "2.2vw" : "1.4vw",
          }}
        >
          Copyright{" "}
          <img
            src={copyright}
            style={{
              height: "1.4vw",
            }}
          />{" "}
          2025 Umi
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Footer;
