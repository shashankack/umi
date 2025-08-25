// ProductsSectionNew.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { motion, useInView, useAnimation } from "framer-motion"; // ✅ Framer (no GSAP)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import slugify from "../../utils/slugify";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";

import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";
import surfingNeko from "../../assets/images/vectors/neko/surfing.gif";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import WaveBackground from "../WaveBackground";

const ProductsSectionNew = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Avoid SSR mismatch for media query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

  // Client-only render gate (for Swiper & viewport APIs)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sectionContainerRef = useRef(null);
  const titleRef = useRef(null);
  const nekoRef = useRef(null);

  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { products } = useProducts();
  const { addItem } = useCart();

  const handleRedirect = (path) => {
    navigate(path);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Wire up Swiper nav after mount
  useEffect(() => {
    if (!mounted) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [mounted, products]);

  // ✅ Framer: trigger a one-time rise when the heading enters view (no scrub)
  const titleInView = useInView(titleRef, {
    margin: "-10% 0% -60% 0%", // tweak when it should trigger
    amount: 0.4,
    once: true, // run once, no scrub
  });
  const waveControls = useAnimation();
  useEffect(() => {
    if (titleInView) {
      waveControls.start({
        y: isMobile ? [0, "-60vh", "-55vh"] : [0, -440, -410],
        transition: {
          duration: 1,
          times: [0, 0.7, 1],
          ease: ["easeOut", "easeIn", "easeIn"],
        },
      });
    }
  }, [titleInView, waveControls]);

  return (
    <Stack
      ref={sectionContainerRef}
      position="relative"
      alignItems="center"
      py={{ xs: 10, sm: 20 }}
      gap={{ xs: 4, sm: 0 }}
      sx={{
        background:
          "linear-gradient(180deg,rgba(253, 248, 206, 1) 50%, rgba(243, 237, 184, 1) 50%);",
      }}
    >
      <Typography
        ref={titleRef}
        sx={{
          textAlign: "center",
          fontSize: { xs: "10vw", sm: "3.6vw" },
          fontWeight: 500,
          fontFamily: theme.fonts.title,
          color: theme.colors.pink,
          textShadow: `2px 2px 0 ${theme.colors.green}`,
          lineHeight: 1.1,
        }}
      >
        Ride the wave <br />
        with umi
      </Typography>

      {/* Neko */}
      <Box
        component="img"
        src={surfingNeko}
        alt="Surfing Neko"
        ref={nekoRef}
        width={{ xs: 200, sm: 300 }}
        position="relative"
        zIndex={2}
      />

      {/* Shop Button */}
      <Button
        onClick={() => handleRedirect("/shop")}
        sx={{
          position: "relative",
          zIndex: 2,
          bgcolor: theme.colors.pink,
          color: theme.colors.beige,
          fontSize: 16,
          fontWeight: 500,
          fontFamily: theme.fonts.text,
          py: 1,
          px: 6,
          borderRadius: 10,
          boxShadow: `2px 4px 0 ${theme.colors.green}`,
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: theme.colors.green,
            boxShadow: `2px 4px 0 ${theme.colors.pink}`,
            transform: "scaleX(1.02)",
          },
        }}
      >
        Shop now
      </Button>

      <Typography
        sx={{
          textAlign: "center",
          fontFamily: theme.fonts.text,
          textTransform: "uppercase",
          color: theme.colors.pink,
          fontSize: 30,
          lineHeight: 1.2,
          fontWeight: 800,
          mt: { xs: 2, md: 14 },
          mb: { xs: 2, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
        Discover our <br /> products
      </Typography>

      {/* Swiper — client-only */}
      {mounted && (
        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          freeMode
          autoplay={{ delay: 5000 }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          style={{
            maxWidth: "1600px",
            width: "100%",
            padding: isMobile ? "0 30px" : "20px 80px",
            position: "relative",
            zIndex: 2,
          }}
          breakpoints={{
            500: { slidesPerView: 1, spaceBetween: "4%" },
            800: { slidesPerView: 2, spaceBetween: "6%" },
            1200: { slidesPerView: 3, spaceBetween: "7%" },
          }}
        >
          <IconButton
            ref={prevRef}
            sx={{
              position: "absolute",
              left: 0,
              zIndex: 1,
              top: "50%",
              transform: "translateY(-50%)",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <ArrowBackIosNewIcon
              fontSize="large"
              sx={{
                color: theme.colors.pink,
                transition: "all 0.3s ease",
                "&:hover": {
                  color: theme.colors.green,
                  transform: "scale(1.1)",
                },
              }}
            />
          </IconButton>

          <IconButton
            ref={nextRef}
            sx={{
              position: "absolute",
              right: 0,
              zIndex: 1,
              top: "50%",
              transform: "translateY(-50%)",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <ArrowForwardIosIcon
              fontSize="large"
              sx={{
                color: theme.colors.pink,
                transition: "all 0.3s ease",
                "&:hover": {
                  color: theme.colors.green,
                  transform: "scale(1.1)",
                },
              }}
            />
          </IconButton>

          {products.map((product) => {
            const title = product.title;
            const price = "Coming Soon";
            const image = product.images?.edges?.[0]?.node?.url;

            return (
              <SwiperSlide
                key={product.id}
                style={{ padding: isMobile ? "10px 20px" : "" }}
              >
                <Stack
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  bgcolor={theme.colors.beige}
                  border={`2px solid ${theme.colors.green}`}
                  borderRadius="280px 280px 0 0"
                  boxShadow={{
                    xs: `2vw 2vw 0 ${theme.colors.pink}`,
                    md: `.8vw .8vw 0 ${theme.colors.pink}`,
                  }}
                  height={{ xs: 450, sm: "65vh" }}
                  pt={4}
                  overflow="hidden"
                >
                  <Typography
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.green,
                      fontSize: 18,
                      width: "60%",
                      textAlign: "center",
                      height: 50,
                    }}
                  >
                    {title}
                  </Typography>

                  <Box
                    component="img"
                    src={image}
                    sx={{
                      width: "80%",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                    onClick={() => handleRedirect(`/shop/${slugify(title)}`)}
                  />

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    height={70}
                    bgcolor={theme.colors.green}
                    color={theme.colors.beige}
                    px={2}
                  >
                    <Typography
                      fontSize={{ xs: 16, md: 18 }}
                      fontWeight={500}
                      fontFamily={theme.fonts.text}
                    >
                      {price}
                    </Typography>

                    <IconButton size="large">
                      <ShoppingCartIcon
                        sx={{
                          color: theme.colors.beige,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            color: theme.colors.pink,
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    </IconButton>
                  </Stack>
                </Stack>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      <Box
        width="100%"
        position="absolute"
        bottom={{ xs: -100, sm: -150 }}
        zIndex={5}
      >
        <CurvedMarquee />
      </Box>

      {/* Wave background — rises once when title enters (no scrub) */}
      <Box
        component={motion.div}
        initial={{ y: 0 }}
        animate={waveControls}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <WaveBackground offsetY={-10} height="200vh" />
      </Box>
    </Stack>
  );
};

export default ProductsSectionNew;
