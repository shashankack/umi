import { Box, Typography, useMediaQuery, useTheme, Stack } from "@mui/material";

import banner from "../assets/images/about_matcha_banner.png";
import bannerMobile from "../assets/images/about_matcha_banner_mobile.png";

import { useNavbarTheme } from "../context/NavbarThemeContext";
import Footer from "../components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

import gallery1 from "../assets/images/matcha-gallery/image_1.png";
import gallery2 from "../assets/images/matcha-gallery/image_2.png";
import gallery3 from "../assets/images/matcha-gallery/image_3.png";
import gallery4 from "../assets/images/matcha-gallery/image_4.png";
import gallery5 from "../assets/images/matcha-gallery/image_5.png";
import gallery6 from "../assets/images/matcha-gallery/image_6.png";
import gallery7 from "../assets/images/matcha-gallery/image_7.png";
import gallery8 from "../assets/images/matcha-gallery/image_8.png";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const AboutMatcha = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setNavbarTheme } = useNavbarTheme();

  const galleryImages = [
    gallery1,
    gallery2,
    gallery4,
    gallery7,
    gallery5,
    gallery6,
    gallery3,
    gallery8,
  ];

  useEffect(() => {
    setNavbarTheme("pink");
  }, [setNavbarTheme]);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Organic Matcha Powder | Umi's Premium Japanese Blend</title>
        <meta
          name="description"
          content="Umi's organic matcha powder is 100% organic, single origin, single cultivar, made in Japan, and spring 1st flush for unmatched taste and quality."
        />
        <meta
          name="keywords"
          content="organic matcha powder, premium matcha, Japanese matcha, ceremonial grade matcha"
        />
      </Helmet>
      <Box bgcolor={theme.colors.beige}>
        <Box height={isMobile ? "35%" : 800}>
          <Box
            component="img"
            src={isMobile ? bannerMobile : banner}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Typography
          py={isMobile ? 2 : 6}
          variant="body1"
          fontSize={isMobile ? "2.8vw" : "1.2vw"}
          color={theme.colors.pink}
          fontFamily={theme.fonts.text}
          width="90%"
          mx="auto"
          textAlign="justify"
          fontWeight={500}
          sx={{
            "& span": {
              color: theme.colors.green,
            },
          }}
        >
          Life comes in waves, matcha your flow
          <br />
          <br />
          <span>Umi</span> means wave.
          <br />
          <br />
          Umi is a premium matcha brand made from the finest, single-origin,
          single-cultivar tea leaves. Our matcha is harvested during the spring
          1st flush from Japan’s most renowned matcha regions. Grown with care,
          it’s 100% organic, free from pesticides and synthetic additives, and
          retains its natural purity and vibrant green color. Each batch is
          crafted for a smooth, umami-rich taste and silky texture, making it
          perfect for both traditional ceremonies and modern culinary use. Our
          matcha represents a symbolic change within the matcha community. We
          hope for our matcha to stay with you through life’s highest highs and
          lowest lows. Made with love by matcha lovers, for matcha lovers.
        </Typography>

        <Stack
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="stretch"
          justifyContent="center"
        >
          <Box
            width={isMobile ? "100%" : "50vw"}
            height={isMobile ? "35vh" : "100vh"}
            overflow="hidden"
            position="relative"
          >
            <Box
              width="100%"
              sx={{
                zIndex: 10,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography
                fontSize={isMobile ? "10vw" : "4.4vw"}
                color={theme.colors.white}
                textAlign="center"
                textTransform="uppercase"
                fontFamily={theme.fonts.text}
                sx={{
                  textShadow: "0px 4px 13.5px rgba(0, 0, 0, 0.83)",
                  cursor: "none",
                  userSelect: "none",
                }}
              >
                Farm to Foam
              </Typography>
            </Box>
            <Swiper
              style={{ height: "100%" }}
              loop
              autoplay={{
                delay: 1000,
              }}
              grabCursor={true}
              effect={"creative"}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ["-20%", 0, -1],
                },
                next: {
                  translate: ["100%", 0, 0],
                },
              }}
              modules={[EffectCreative, Autoplay]}
            >
              {galleryImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Box
                    component="img"
                    src={image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            width={isMobile ? "100%" : "50vw"}
            height={isMobile ? "auto" : "100vh"}
            bgcolor={theme.colors.pink}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={isMobile ? 2 : 10}
          >
            <Typography
              fontFamily={theme.fonts.text}
              fontSize={isMobile ? "2.8vw" : "1.2vw"}
              color={theme.colors.beige}
              textAlign="justify"
            >
              In the quiet hills of Wazuka, Japan where morning mists cling
              gently to the tea fields - we stood among rows of vibrant green
              leaves at the farm. This wasn’t just a visit; it was a pilgrimage
              to the source of purity.
              <br />
              <br />
              Our farm is rooted in integrity, where matcha is grown without
              herbicides, pesticides, or synthetic fertilizers. Every leaf is
              nurtured by hand, tana shaded with care, and stone-milled to
              preserve its rich umami and vivid hue. From the soils of Wazuka to
              the matcha bowls of India, this journey is a tribute to the beauty
              of intention. It’s about honouring tradition while embracing a
              global vision - where every sip carries the story of a farm, a
              philosophy, and a promise.
              <br />
              <br />
              This is farm to foam and it's only the beginning.
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Footer />
    </>
  );
};

export default AboutMatcha;
