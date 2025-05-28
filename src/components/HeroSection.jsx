import {
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Typography,
  IconButton,
  Icon,
} from "@mui/material";
import { useEffect, useRef } from "react";

import { useNavbarTheme } from "../context/NavbarThemeContext";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import sakura from "../assets/images/vectors/sakura.png";
import leaf1 from "../assets/images/vectors/leaf1.png";
import leaf2 from "../assets/images/vectors/leaf2.png";
import leaf3 from "../assets/images/vectors/leaf3.png";
import soupBowl from "../assets/images/vectors/soup_bowl.png";
import whisk from "../assets/images/vectors/whisk.png";

import haruTin from "../assets/images/products/haru_tin.png";
import nakaiTin from "../assets/images/products/nakai_tin.png";
import matchaLatte from "../assets/images/products/matcha_latte.png";
import whiskk from "../assets/images/products/whisk.png";
import whiskHolder from "../assets/images/products/whisk_holder.png";
import scoop from "../assets/images/products/scoop.png";
import bowl from "../assets/images/products/bowl.png";

const products = [
  {
    title: "Haru Ceremonial",
    image: haruTin,
    price: 2999.0,
  },

  {
    title: "Nakai Ceremonial",
    image: nakaiTin,
    price: 1999.0,
  },

  {
    title: "Instant Matcha Latte",
    image: matchaLatte,
    price: 999.0,
  },
  {
    title: "Umi Bowl Chawan",
    image: bowl,
    price: 1949.0,
  },
  {
    title: "Umi Whisk - Chasen",
    image: whiskk,
    price: 1049.0,
  },
  {
    title: "Umi Scoop - Chashaku",
    image: scoop,
    price: 499.0,
  },
  {
    title: "Umi Whisk Holder",
    image: whiskHolder,
    price: 1349.0,
  },
];

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setNavbarTheme } = useNavbarTheme();

  const vectorProperties = () => {
    const vw = (percent) => (window.innerWidth * percent) / 100;
    const vh = (percent) => (window.innerHeight * percent) / 100;

    return {
      leaf1: { from: { x: -vw(10), y: -vh(2) }, to: { x: 0, y: 0 } },
      leaf2: { from: { x: vw(10), y: -vh(2) }, to: { x: 0, y: 0 } },
      leaf3: { from: { x: -vw(8), y: vh(3) }, to: { x: 0, y: 0 } },
      leaf4: { from: { x: vw(8), y: vh(3) }, to: { x: 0, y: 0 } },
      soupBowl: { from: { y: vh(5) }, to: { y: 0 } },
      whisk: { from: { x: vw(4), y: vh(3) }, to: { x: 0, y: 0 } },
    };
  };

  const vectorsPositions = [
    { img: leaf1, top: 10, left: 0, width: "12vw" },
    { img: leaf2, bottom: 0, left: 0, width: "12vw" },
    { img: leaf3, top: 10, left: 46, width: "17vw", rotate: 0 },
    { img: whisk, bottom: 10, right: 10, width: "16vw", rotate: -10 },
    { img: soupBowl, bottom: 0, left: 30, width: "16vw" },
  ];

  const bottomBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    height: "100%",
    borderRight: `4px solid ${theme.colors.green}`,
    "&:last-child": {
      borderRight: "none",
    },
  };

  const textStyle = {
    fontFamily: theme.fonts.heading,
    textAlign: "start",
    fontSize: isMobile ? "6vw" : "6.4vw",
    fontWeight: 800,
    lineHeight: 1,
    textTransform: "uppercase",
    color: theme.colors.beige,
    textShadow: `5px 5px 0 ${theme.colors.green}`,
    zIndex: 10,
  };

  return (
    <Box
      height="100vh"
      bgcolor={theme.colors.pink}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="row"
      position="relative"
    >
      <Box className="checkered-grid" position="absolute" bottom={10} left={0}>
        {[...Array(2)].map((_, rowIdx) => (
          <Box className="row" key={rowIdx}>
            {[...Array(isMobile ? 13 : 40)].map((_, colIdx) => (
              <Box
                key={colIdx}
                className="square"
                sx={{
                  bgcolor:
                    (rowIdx + colIdx) % 2 === 0
                      ? theme.colors.green
                      : theme.colors.beige,
                }}
              ></Box>
            ))}
          </Box>
        ))}
      </Box>
      ;{/* Left */}
      <Box
        width="60%"
        height="100%"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        border={1}
        position={"relative"}
        px={14}
      >
        {/* Vectors */}
        {vectorsPositions.map((vector, index) => (
          <Box
            key={index}
            component="img"
            src={vector.img}
            position="absolute"
            top={`${vector.top}%`}
            left={`${vector.left}%`}
            bottom={`${vector.bottom}%`}
            right={`${vector.right}%`}
            width={vector.width}
            sx={{
              transform: `rotate(${vector.rotate}deg)`,
            }}
          />
        ))}

        {/* Text Section */}
        <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
          <Typography sx={textStyle}>Umi is</Typography>
        </Box>
        <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
          <Typography sx={textStyle}>so matcha</Typography>
        </Box>
        <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
          <Typography sx={textStyle}>better</Typography>
        </Box>
      </Box>
      {/* Right */}
      <Box
        width="40%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        py={"6vh"}
      >
        <Box
          height="70vh"
          maxWidth={420}
          width="100%"
          bgcolor={theme.colors.beige}
          sx={{
            border: `4px solid ${theme.colors.green}`,
            borderRadius: "200px 200px 0px 0px;",
            boxShadow: `8px 8px 0px 0px ${theme.colors.green}`,
          }}
        >
          <Stack
            height="100%"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
          >
            <Box
              width="100%"
              height="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <IconButton sx={{ color: theme.colors.green }}>
                <Icon component={IoIosArrowBack} fontSize="large" />
              </IconButton>
              <IconButton
                sx={{
                  color: theme.colors.green,
                }}
              >
                <Icon component={IoIosArrowForward} fontSize="large" />
              </IconButton>
            </Box>

            <Box mt={4} width="60%">
              <Typography
                fontFamily={theme.fonts.text}
                fontSize="1.2vw"
                fontWeight={700}
                color={theme.colors.green}
                textAlign="center"
              >
                Instant Matcha Latte
              </Typography>
            </Box>
            <Box width="100%" height="60%">
              <Box
                component="img"
                src={products[0].image}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderTop: `4px solid ${theme.colors.green}`,
              }}
            >
              <Box sx={bottomBox}>
                <Typography>Made in Japan</Typography>
              </Box>
              <Box sx={bottomBox}>
                <Typography>Price: 2999</Typography>
              </Box>
              <Box sx={bottomBox}>
                <Box
                  component="img"
                  src={sakura}
                  sx={{
                    width: "60%",
                    height: "60%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
