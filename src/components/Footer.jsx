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
    fontSize: isMobile ? "2.4vw" : "1.6vw",
    transition: "all 0.3s ease",

    "&:hover": {
      cursor: "pointer",
      color: theme.colors.green,
      transform: "scale(1.05)",
    },
  };

  const iconStyles = {
    textDecoration: "none",
    color: theme.colors.beige,
    bgcolor: theme.colors.green,
    fontFamily: theme.fonts.text,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: isMobile ? "4.2vw" : "3vw",
    height: isMobile ? "4.2vw" : "3vw",
    transition: "all 0.3s ease",

    "&:hover": {
      cursor: "pointer",
      bgcolor: theme.colors.pink,
      transform: "scale(1.1) rotate(-20deg)",
    },
  };

  const navLinks = [
    [
      { name: "Shop", path: "/shop" },
      { name: "Story", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Our matcha", path: "/" },
    ],
    [
      { name: "Terms of service", path: "/" },
      { name: "Refund policy", path: "/" },
      { name: "Privacy policy", path: "/" },
      { name: "FAQ", path: "/" },
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
      <Box
        position="absolute"
        bottom={isMobile ? 50 : 100}
        right={50}
        height={isMobile ? "8vh" : "22vh"}
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
      <Stack direction="column" alignItems="center" gap={isMobile ? 2 : 4}>
        <Box width={isMobile ? "15vw" : "10vw"}>
          <Box
            component="img"
            src={pinkMonogram}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box width={isMobile ? "15vw" : "10vw"}>
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
          fontSize={isMobile ? "2.3vw" : "1.6vw"}
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
            <Link key={index} sx={navLinkStyles}>
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
                <FaInstagram size={isMobile ? 14 : "2.2vw"} />
              )}
              {linkGroup.name === "Pinterest" && (
                <FaPinterestP size={isMobile ? 14 : "2.2vw"} />
              )}
              {linkGroup.name === "WhatsApp" && (
                <FaWhatsapp size={isMobile ? 14 : "2.2vw"} />
              )}
            </Link>
          ))}
        </Stack>
      </Stack>
      <Stack justifyContent="space-between">
        <Stack gap={isMobile ? 0.5 : 2}>
          {navLinks[1].map((linkGroup, index) => (
            <Link key={index} sx={navLinkStyles}>
              {linkGroup.name}
            </Link>
          ))}
        </Stack>
        <Typography
          sx={{
            color: theme.colors.pink,
            fontFamily: theme.fonts.text,
            fontSize: isMobile ? "2.2vw" : "1.6vw",
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
