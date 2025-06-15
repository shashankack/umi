import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

// Icons
import { FaShoppingCart } from "react-icons/fa";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { fetchShopifyProducts } from "../utils/shopify";
import { useCart } from "../context/CartContext";

import {
  Button,
  IconButton,
  Icon,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
} from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import surfing from "../assets/images/vectors/neko/surfing.gif";
import CurvedMarquee from "./CurvedMarquee/CurvedMarquee";

gsap.registerPlugin(ScrollTrigger);
const Test = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const titleRef = useRef(null);
  const svgRef = useRef(null);
  const nekoRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef = useRef(null);

  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        console.log("Incoming products data:", data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      gsap.fromTo(
        svgRef.current,
        { height: "70%" },
        {
          height: isMobile ? "155%" : "140%",
          duration: 1.4,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
            // markers: true,
          },
        }
      );
    }
  }, []);

  return (
    <Box width="100%" position="relative">
      <Stack
        justifyContent="center"
        alignItems="center"
        bgcolor={theme.colors.beige}
        pt="5%"
        pb={isMobile ? 18 : "10%"}
        position="relative"
        overflow="hidden"
      >
        <Stack zIndex={5} justifyContent="center" alignItems="center">
          <Typography
            fontFamily={theme.fonts.title}
            color={theme.colors.pink}
            fontSize={isMobile ? "8vw" : "3.6vw"}
            textAlign="center"
            sx={{
              textShadow: isMobile
                ? `1px 4px 0px ${theme.colors.green}`
                : `1px 7px 0px ${theme.colors.green}`,
            }}
          >
            Ride the wave <br />
            with umi
          </Typography>
          <Box
            component="img"
            src={surfing}
            alt="Surfing Neko"
            sx={{
              height: isMobile ? 200 : 260,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disableRipple
            sx={{
              marginTop: "2rem",
              fontFamily: theme.fonts.text,
              fontSize: isMobile ? "3vw" : ".8vw",
              padding: isMobile ? ".4rem 3rem" : "0.6rem 3rem",
              bgcolor: theme.colors.green,
              color: theme.colors.beige,
              boxShadow: `4px 4px 0 ${theme.colors.pink}`,
              borderRadius: 10,
              "&:hover": {
                bgcolor: theme.colors.pink,
                color: theme.colors.beige,
                boxShadow: `3px 3px 0 ${theme.colors.green}`,
              },
            }}
            onClick={() => {
              navigate("/shop");
              window.scrollTo(0, 0);
            }}
          >
            Shop Now
          </Button>

          <Typography
            color={theme.colors.pink}
            fontFamily={theme.fonts.text}
            textAlign="center"
            fontSize={isMobile ? "7vw" : "1.8vw"}
            lineHeight={1.1}
            fontWeight={900}
            textTransform="uppercase"
            mt={6}
          >
            Discover our <br /> products
          </Typography>
        </Stack>

        <Box width={"100%"} position="relative">
          <IconButton
            ref={prevRef}
            disableRipple
            className="custom-swiper-prev"
            sx={{
              position: "absolute",
              top: "50%",
              left: isMobile ? -15 : 10,
              transform: "translateY(-50%)",
              zIndex: 20,
              color: theme.colors.pink,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "transparent",
                transform: "translateY(-50%) scale(1.2)",
              },
            }}
            size="large"
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <IconButton
            ref={nextRef}
            disableRipple
            className="custom-swiper-next"
            sx={{
              position: "absolute",
              top: "50%",
              right: isMobile ? -15 : 10,
              transform: "translateY(-50%)",
              zIndex: 20,
              color: theme.colors.pink,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "transparent",
                transform: "translateY(-50%) scale(1.2)",
              },
            }}
            size="large"
          >
            <ArrowForwardIosIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            loop
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 40 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 60 },
              1500: { slidesPerView: 4, spaceBetween: 30 },
            }}
            autoplay={{ delay: 3000 }}
            style={{
              zIndex: 10,
              height: isMobile ? 500 : 600,
              width: "90%",
              marginTop: 30,
              padding: 15,
            }}
          >
            {products.map((product) => {
              const title = product.title;
              const imageUrl = product.images.edges[0]?.node.url;
              const price = product.variants.edges[0]?.node.price.amount;
              const variantId = product.variants.edges[0]?.node.id;
              const productId = product.id.split("/").pop();

              return (
                <SwiperSlide
                  position="relative"
                  key={product.id}
                  style={{
                    backgroundColor: theme.colors.beige,
                    height: "90%",
                    border: `2px solid ${theme.colors.green}`,
                    borderRadius: "285.5px 285.5px 0px 0px",
                    boxShadow: isMobile
                      ? `6px 6px 0px ${theme.colors.pink}`
                      : `10px 10px 0px ${theme.colors.pink}`,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "0 auto",
                  }}
                >
                  <Typography
                    width="60%"
                    textAlign="center"
                    mt={6}
                    color={theme.colors.green}
                    fontFamily={theme.fonts.text}
                    fontSize={isMobile ? "4vw" : "1.2vw"}
                  >
                    {title}
                  </Typography>
                  <Box
                    height="60%"
                    width="100%"
                    sx={{
                      transition: "all 0.3s ease",

                      "&:hover": {
                        transform: "scale(1.05)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      navigate(`/product/${productId}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    px={4}
                    height={80}
                    bgcolor={theme.colors.green}
                  >
                    <Typography
                      color={theme.colors.beige}
                      fontFamily={theme.fonts.text}
                      fontSize={isMobile ? "3vw" : "1vw"}
                    >
                      ₹ {price}
                    </Typography>

                    <IconButton
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        bgcolor: theme.colors.pink,
                        color: theme.colors.beige,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: theme.colors.beige,
                          color: theme.colors.pink,
                        },
                      }}
                      onClick={() => addItem(variantId, 1)}
                    >
                      <Icon>
                        <FaShoppingCart size={20} />
                      </Icon>
                    </IconButton>
                  </Stack>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>

        {/* Wave Svg */}
        <Box
          ref={svgRef}
          component="svg"
          width={isMobile ? "300%" : "100vw"}
          height={isMobile ? "190%" : "100%"}
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <path fill="#F3EDB8">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
      M0,100 
      C180,120 360,90 540,100 
      C720,110 900,90 1080,100 
      C1260,110 1440,90 1620,100 
      L1440,200 L0,200 Z;

      M-180,100 
      C0,120 190,90 360,100 
      C540,110 720,90 900,100 
      C1080,110 1260,90 1440,100 
      L1440,200 L0,200 Z;

      M0,100 
      C180,120 360,90 540,100 
      C720,110 900,90 1080,100 
      C1260,110 1440,90 1620,100 
      L1440,200 L0,200 Z
    "
            />
          </path>
        </Box>
      </Stack>

      <Box
        width="100%"
        zIndex={10}
        position="absolute"
        bottom={isMobile ? -100 : -140}
      >
        <CurvedMarquee />
      </Box>
    </Box>
  );
};

export default Test;
