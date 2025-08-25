import {
  Box,
  Grid,
  Typography,
  useTheme,
  Collapse,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCreative,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import "./AboutSection.scss";

import cloud from "../../assets/images/vectors/cloud.png";
import paw from "../../assets/images/vectors/paw.png";
import matchaField from "../../assets/images/matcha_field.png";
import banner from "../../assets/images/about_matcha_banner.png";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    title: "*",
    description: "100% organic",
  },
  {
    title: "*",
    description: "Single origin",
  },
  {
    title: "*",
    description: "Single cultivar",
  },
  {
    title: "*",
    description: "Spring 1st flush",
  },
  {
    title: "*",
    description: "Made in Japan",
  },
];

const AboutSection = () => {
  const theme = useTheme();
  const images = [matchaField, matchaField, matchaField, matchaField];
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMorePara1, setShowMorePara1] = useState(false);
  const [showMorePara2, setShowMorePara2] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".cloud",
      { scale: 3, opacity: 0, y: -350 },
      {
        y: 150,
        scale: 1,
        opacity: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cloud",
          start: "top+=600 40%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.utils.toArray(".about-text").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.colors.green,
        py: { xs: 6, md: 12 },
        overflow: "hidden",
        zIndex: 1,
        position: "relative",
      }}
    >
      <Box position="absolute" top={0} left={0} height="100vh" width="100%">
        <Box
          component="img"
          src={banner}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box sx={{ textAlign: "justify", color: theme.colors.beige, mb: 10 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Genty",
            fontSize: { xs: "3rem", md: "4rem" },
            mb: 2,
            textShadow: "0px 5.475px 0px rgba(0, 0, 0, 0.25)",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          About our matcha
        </Typography>
        <Grid
          container
          backgroundColor={theme.colors.beige}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid size={12} display={"flex"} justifyContent={"center"} p={1}>
            <Typography
              fontSize={isMobile ? "1rem" : "2rem"}
              color={theme.colors.pink}
              fontFamily={theme.fonts.text}
              fontWeight={500}
            >
              Kinder rituals that fill your cup
            </Typography>
          </Grid>
          {stats.map((stat, i) => (
            <Grid
              p={isMobile ? 0 : 3}
              key={i}
              sx={{ backgroundColor: theme.colors.beige }}
            >
              <Box
                key={i}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  variant="h1"
                  color={i % 2 === 0 ? theme.colors.pink : theme.colors.green}
                  fontFamily={theme.fonts.text}
                  fontWeight={500}
                  fontSize={{ xs: 20, md: 40 }}
                  textAlign={"center"}
                >
                  {stat.title}
                </Typography>
                <Typography
                  variant="h4"
                  color={i % 2 === 0 ? theme.colors.green : theme.colors.pink}
                  fontFamily={theme.fonts.text}
                  fontWeight={500}
                  fontSize={{ xs: 10, md: 24 }}
                  marginBottom={isMobile ? 2 : 0}
                  textAlign={"center"}
                  width="70%"
                >
                  {stat.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box width={isMobile ? "95%" : "80%"} position="relative" border={1} mx="auto" mt="70vh">
        <Box className="about-text" mt={-5} mb={20}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Stolzl",
              fontSize: isMobile ? 16 : 26,
              color: theme.colors.beige,
              textAlign: "justify",
            }}
          >
            Life comes in waves, matcha your flow <br />
            <br /> Umi: wave <br />
            <br />
            Umi is a premium matcha brand that is crafted from the finest,
            single-origin, and single-cultivar tea leaves that are spring 1st
            flush harvest sourced exclusively from Japan's most renowned
            matcha-growing regions. Cultivated with meticulous care, our matcha
            is 100% certified organic, free of pesticides, herbicides and
            synthetic fertilisers ensuring a clean product that retains its
            natural purity and vibrant green colour. Each batch is harvested
            from a single cultivar, allowing for a distinct, consistent flavour
            profile that reflects the terroir of its origin. With a smooth,
            umami-rich taste and a silky texture, our matcha is ideal for both
            traditional ceremonial use and contemporary culinary applications.
          </Typography>

          <Collapse in={showMorePara1}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Stolzl",
                fontSize: isMobile ? 16 : 26,
                color: theme.colors.beige,
                textAlign: "justify",
                mt: 2,
              }}
            >
              Perfect for discerning matcha enthusiasts seeking exceptional
              quality in every sip. Umi is a premium matcha brand crafted from
              the finest, single-origin, and single-cultivar tea leaves,
              harvested during the first flush of spring from Japan's most
              renowned matcha-growing regions. Cultivated with meticulous care,
              our matcha is 100% certified organic, free of pesticides,
              herbicides, and synthetic fertilizers, ensuring a clean product
              that retains its natural purity and vibrant green color. Each
              batch is harvested from a single cultivar, allowing for a
              distinct, consistent flavour profile that reflects the terroir of
              its origin. With a smooth, umami-rich taste and a silky texture,
              our matcha is ideal for both traditional ceremonial use and
              contemporary culinary applications—perfect for discerning matcha
              enthusiasts seeking exceptional quality in every sip. Our matcha
              represents a symbolic change within the matcha community. We hope
              for our matcha to stay with you through life’s highest highs and
              lowest lows. Made with love by matcha lovers, for matcha lovers.
            </Typography>
          </Collapse>

          <Typography
            variant="text"
            sx={{
              mt: 2,
              color: theme.colors.pink,
              textTransform: "none",
              fontFamily: "Stolzl",
              background: "none",
              fontSize: { xs: 12, md: 18 },
              cursor: "pointer",
            }}
            onClick={() => setShowMorePara1((prev) => !prev)}
          >
            {showMorePara1 ? "Read less..." : "Read more..."}
          </Typography>
        </Box>
        <Box position="relative" height={{ xs: 300, md: 600 }}>
          <Box
            className="cloud"
            sx={{
              position: "absolute",
              top: { xs: "-70%", md: "40%", lg: "-40%" },
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: 150, md: 200 },
              zIndex: 10,
            }}
          >
            <img src={cloud} alt="cloud" style={{ width: "100%" }} />
          </Box>

          <Swiper
            grabCursor
            loop
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            navigation={{ nextEl: ".next-icon", prevEl: ".prev-icon" }}
            effect="creative"
            creativeEffect={{
              prev: { shadow: true, translate: [0, 0, -400] },
              next: { translate: ["100%", 0, 0] },
            }}
            modules={[EffectCreative, Pagination, Navigation, Autoplay]}
            style={{
              height: "100%",
            }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`Matcha ${i}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}

            <IconButton className="next-icon" sx={navIconStyle(true)}>
              <img src={paw} alt="next" style={{ width: "100%" }} />
            </IconButton>
            <IconButton className="prev-icon" sx={navIconStyle(false)}>
              <img src={paw} alt="prev" style={{ width: "100%" }} />
            </IconButton>
          </Swiper>
        </Box>

        <Box sx={{ color: theme.colors.beige, mt: { xs: 4, md: 10 } }}>
          {isMobile ? (
            <>
              <Typography
                sx={{
                  fontFamily: "Stolzl",
                  fontSize: { xs: 14, md: 20 },
                  textAlign: "justify",
                  mt: 4,
                }}
              >
                In the quiet hills of Wazuka, Japan where morning mists cling
                gently to the tea fields - we stood among rows of vibrant green
                leaves at the farm. This wasn’t just a visit; it was a
                pilgrimage to the source of purity.
              </Typography>
              <Collapse in={showMorePara2}>
                <Typography
                  sx={{
                    fontFamily: "Stolzl",
                    fontSize: { xs: 14, md: 20 },
                    textAlign: "justify",
                    mt: 2,
                  }}
                >
                  Our farm is rooted in integrity, where matcha is grown without
                  herbicides, pesticides, or synthetic fertilizers. Every leaf
                  is nurtured by hand, tana shaded with care, and stone-milled
                  to preserve its rich umami and vivid hue. From the soils of
                  Wazuka to the matcha bowls of India, this journey is a tribute
                  to the beauty of intention. It's about honouring tradition
                  while embracing a global vision - where every sip carries the
                  story of a farm, a philosophy, and a promise. This is farm to
                  foam and it's only the beginning.",
                </Typography>
              </Collapse>

              <Typography
                variant="text"
                sx={{
                  mt: 2,
                  color: theme.colors.pink,
                  textTransform: "none",
                  fontFamily: "Stolzl",
                  background: "none",
                  fontSize: { xs: 12, md: 18 },
                }}
                onClick={() => setShowMorePara2((prev) => !prev)}
              >
                {showMorePara2 ? "Read less..." : "Read more..."}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontFamily: "Stolzl",
                fontSize: { xs: 18, md: 26 },
                textAlign: "justify",
                mt: 4,
              }}
            >
              In the quiet hills of Wazuka, Japan where morning mists cling
              gently to the tea fields - we stood among rows of vibrant green
              leaves at the farm. This wasn’t just a visit; it was a pilgrimage
              to the source of purity. Our farm is rooted in integrity, where
              matcha is grown without herbicides, pesticides, or synthetic
              fertilizers. Every leaf is nurtured by hand, tana shaded with
              care, and stone-milled to preserve its rich umami and vivid hue.
              From the soils of Wazuka to the matcha bowls of India, this
              journey is a tribute to the beauty of intention. It’s about
              honouring tradition while embracing a global vision - where every
              sip carries the story of a farm, a philosophy, and a promise. This
              is farm to foam and it's only the beginning.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const navIconStyle = (isNext) => ({
  position: "absolute",
  top: "45%",
  [isNext ? "right" : "left"]: 20,
  transform: `rotate(${isNext ? 90 : -90}deg)`,
  width: { xs: 50, md: 80 },
  height: { xs: 50, md: 80 },
  zIndex: 10,
  transition: "all 0.3s ease",
  ":hover": {
    transform: `scale(0.9) rotate(${isNext ? 90 : -90}deg)`,
  },
  ":active": {
    transform: `scale(1) rotate(${isNext ? 90 : -90}deg)`,
  },
});

export default AboutSection;
