import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
} from "@mui/material";

import Footer from "../components/Footer";

import step1 from "../assets/images/vectors/about/step1.png";
import step2 from "../assets/images/vectors/about/step2.png";
import step3 from "../assets/images/vectors/about/step3.png";
import step4 from "../assets/images/vectors/about/step4.png";
import neko from "../assets/images/vectors/neko/cup.png";

import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Brewing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setNavbarTheme } = useNavbarTheme();
  const location = useLocation();

  useEffect(() => {
    setNavbarTheme("beige");
  }, [setNavbarTheme]);

  const stepsData = [
    {
      image: step1,
      text: "Sift 2-3 tsp of <br />Umi matcha into <br />a bowl.",
    },
    {
      image: step2,
      text: "Add 60ml of warm <br />water and whisk <br />until smooth.",
    },
    {
      image: step3,
      text: "Pour milk of <br />your choice.",
    },
    {
      image: step4,
      text: "Add sweetner of <br />your choice.",
    },
  ];

  return (
    <>
      <Stack
        overflow="hidden"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={theme.colors.pink}
        gap={isMobile ? 4 : 6}
        pt={location.pathname !== "/" ? (isMobile ? 4 : 8) : 0}
      >
        <Helmet>
          <title>
            How to Make Matcha at Home | Umi Matcha - Premium Japanese Matcha
          </title>
          <meta
            name="description"
            content="Learn how to make matcha at home with Umi’s step-by-step brewing guide. Create the perfect, smooth cup using the best organic matcha powder in India."
          />
          <meta
            name="keywords"
            content="how to make matcha at home, best organic matcha powder in India"
          />
        </Helmet>
        <Typography
          fontFamily={theme.fonts.title}
          variant="h2"
          color={theme.colors.beige}
          fontSize={isMobile ? "8vw" : "4vw"}
          mt={10}
        >
          Brew it the Umi way
        </Typography>

        <Box mx="auto" height={isMobile ? 150 : 300}>
          <Box
            component="img"
            src={neko}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Stack
          width="100%"
          justifyContent="space-around"
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? 5 : 0}
        >
          {stepsData.map((step, index) => (
            <Stack
              key={index}
              direction={!isMobile ? "column" : "row"}
              alignItems="center"
              justifyContent={isMobile ? "center" : "start"}
              gap={isMobile ? 0 : 2}
            >
              <Box
                height={isMobile ? 70 : 150}
                width={isMobile ? "30%" : "auto"}
              >
                <Box
                  component="img"
                  src={step.image}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                width={isMobile ? "40%" : "100%"}
                textAlign={isMobile ? "start" : "center"}
                fontSize={isMobile ? "4vw" : "1vw"}
                fontFamily={theme.fonts.text}
                color={theme.colors.beige}
                dangerouslySetInnerHTML={{ __html: step.text }}
              />
            </Stack>
          ))}
        </Stack>

        <Box
          width="100%"
          my={10}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Divider
            width="100%"
            sx={{
              border: `2px solid ${theme.colors.beige}`,
            }}
          />
          <Typography
            variant="h4"
            whiteSpace="nowrap"
            mx={2}
            fontFamily={theme.fonts.heading}
            color={theme.colors.beige}
          >
            video tutorial
          </Typography>
          <Divider
            width="100%"
            sx={{
              border: `2px solid ${theme.colors.beige}`,
            }}
          />
        </Box>
        <Box
          mb={10}
          width={isMobile ? "90%" : "80vw"}
          height={isMobile ? " 34vh" : "60vh"}
          display="flex"
          justifyContent="center"
          overflow="hidden"
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/13uVij4DsZk?si=04sgpl12Syb3EGRR"
            title="YouTube video player"
            style={{
              border: `4px solid ${theme.colors.beige}`,
              borderRadius: 25,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Box>
      </Stack>
      <Footer />
    </>
  );
};

export default Brewing;
