import {
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Typography,
  IconButton,
  Icon,
} from "@mui/material";
import { useEffect, useRef, useState } from "react"; // Added useState
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    description: "Made in Japan",
  },
  {
    title: "Nakai Ceremonial",
    image: nakaiTin,
    price: 1999.0,
    description: "Made in Japan",
  },
  {
    title: "Instant Matcha Latte",
    image: matchaLatte,
    price: 999.0,
    description: "Made in Japan",
  },
  {
    title: "Umi Bowl Chawan",
    image: bowl,
    price: 1949.0,
    description: "Handcrafted",
  },
  {
    title: "Umi Whisk - Chasen",
    image: whiskk,
    price: 1049.0,
    description: "Handcrafted",
  },
  {
    title: "Umi Scoop - Chashaku",
    image: scoop,
    price: 499.0,
    description: "Handcrafted",
  },
  {
    title: "Umi Whisk Holder",
    image: whiskHolder,
    price: 1349.0,
    description: "Handcrafted",
  },
];

gsap.registerPlugin(ScrollTrigger);
const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setNavbarTheme } = useNavbarTheme();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const leaf1Ref = useRef(null);
  const leaf2Ref = useRef(null);
  const leaf3Ref = useRef(null);
  const soupBowlRef = useRef(null);
  const whiskRef = useRef(null);
  const textContainerRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const productImageRef = useRef(null);
  const productTitleRef = useRef(null);
  const productPriceRef = useRef(null);
  const productDescriptionRef = useRef(null);
  const sakuraRef = useRef(null);
  const rightSectionRef = useRef(null);

  const vectorsPositions = [
    {
      img: leaf1,
      top: 10,
      left: 0,
      width: "10vw",
      ref: leaf1Ref,
      animations: { from: 20, to: 0 },
    },
    {
      img: leaf2,
      bottom: 0,
      left: 0,
      width: "12vw",
      ref: leaf2Ref,
      animations: { from: 20, to: 0 },
    },
    {
      img: leaf3,
      top: 10,
      left: 50,
      width: "17vw",
      rotate: 0,
      ref: leaf3Ref,
      animations: { from: 20, to: 0 },
    },
    {
      img: whisk,
      bottom: 10,
      right: 0,
      width: "18vw",
      rotate: -10,
      ref: whiskRef,
      animations: { from: 20, to: 0 },
    },
    {
      img: soupBowl,
      bottom: -2,
      left: 30,
      width: "16vw",
      ref: soupBowlRef,
      animations: { from: 20, to: 0 },
    },
  ];

  const bottomBoxStyle = {
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

  // Handle product change
  const handleProductChange = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentProductIndex + 1) % products.length
        : (currentProductIndex - 1 + products.length) % products.length;

    const dirMultiplier = direction === "next" ? 1 : -1;

    // Outro animation timeline
    const outroTl = gsap.timeline({
      onComplete: () => {
        setCurrentProductIndex(newIndex);
        if (productTitleRef.current)
          productTitleRef.current.textContent = products[newIndex].title;
        if (productDescriptionRef.current)
          productDescriptionRef.current.textContent =
            products[newIndex].description;
        if (productPriceRef.current)
          productPriceRef.current.textContent = `Price: ${products[newIndex].price}`;

        gsap.set(productImageRef.current, {
          x: dirMultiplier * 100,
          rotate: -dirMultiplier * 20,
          opacity: 0,
        });
        gsap.set(
          [
            productTitleRef.current,
            productDescriptionRef.current,
            productPriceRef.current,
          ],
          {
            y: -50,
            opacity: 0,
          }
        );

        // Intro animation timeline
        const introTl = gsap.timeline();

        introTl.to(productImageRef.current, {
          x: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out",
        });

        introTl.to(productImageRef.current, {
          y: 10,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        introTl.to(
          [
            productTitleRef.current,
            productDescriptionRef.current,
            productPriceRef.current,
          ],
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
          },
          "<"
        );
      },
    });

    outroTl.to(
      [
        productTitleRef.current,
        productDescriptionRef.current,
        productPriceRef.current,
      ],
      {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.1,
      },
      "-=0.2"
    );

    outroTl.to(
      productImageRef.current,
      {
        x: dirMultiplier * -100,
        rotate: dirMultiplier * 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "<"
    );

    outroTl.to(
      sakuraRef.current,
      {
        rotate: `+=${dirMultiplier * 180}`,
        delay: 0.2,
        duration: 0.5,
        ease: "back.out",
      },
      "<"
    );
  };

  // Auto Slide
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      handleProductChange("next");
    }, 3000);

    return () => clearInterval(interval);
  }, [currentProductIndex]);

  // Left Animations
  useEffect(() => {
    setNavbarTheme("beige");

    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: leaf1Ref.current?.parentNode,
        start: "top 40%",
        // markers: true,
      },
    });

    introTl.fromTo(
      [
        leaf1Ref.current,
        leaf2Ref.current,
        leaf3Ref.current,
        soupBowlRef.current,
        whiskRef.current,
      ],
      {
        opacity: 0,
        y: (i) => {
          const vectorData = vectorsPositions[i];
          return vectorData.animations?.from || 20;
        },
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      }
    );

    gsap.to(textContainerRef.current, {
      y: 60,
      scaleY: 0.8,
      textShadow: `10px 10px 10px ${theme.colors.green}`,
      ease: "none",
      scrollTrigger: {
        trigger: textContainerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true,
      },
    });

    // Text slide up
    const textElements = document.querySelectorAll("[data-text-slide]");

    introTl.fromTo(
      textElements,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
      },
      "<"
    );

    // Right section intro animation
    introTl.fromTo(
      [
        productTitleRef.current,
        productPriceRef.current,
        productDescriptionRef.current,
      ],
      {
        y: -50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.1,
      },
      ">"
    );

    introTl.fromTo(
      productImageRef.current,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      },
      "<0.2"
    );

    introTl.fromTo(
      sakuraRef.current,
      {
        rotation: 180,
        scale: 0,
      },
      {
        rotation: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      },
      "<"
    );

    introTl.add(() => {
      const oscillateVectors = [
        leaf1Ref.current,
        leaf2Ref.current,
        leaf3Ref.current,
        whiskRef.current,
      ];

      oscillateVectors.forEach((el) => {
        if (!el) return;

        const amplitude = gsap.utils.random(10, 25);
        const duration = gsap.utils.random(2, 3);
        const delay = gsap.utils.random(0, duration);

        gsap.to(el, {
          y: amplitude,
          duration: duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay,
        });
      });

      gsap.to(soupBowlRef.current, {
        rotation: -360,
        duration: 14,
        ease: "linear",
        repeat: -1,
      });
    });

    return () => {
      setNavbarTheme("default");

      gsap.killTweensOf([
        leaf1Ref.current,
        leaf2Ref.current,
        leaf3Ref.current,
        soupBowlRef.current,
        whiskRef.current,
        ...textElements,
        productTitleRef.current,
        productPriceRef.current,
        productDescriptionRef.current,
        productImageRef.current,
        sakuraRef.current,
      ]);

      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <Box
      height="100vh"
      bgcolor={theme.colors.pink}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection={isMobile ? "column" : "row"}
      position="relative"
      overflow="hidden"
    >
      {/* Checkered Background */}
      <Box
        className="checkered-grid"
        position="absolute"
        bottom={0}
        left={0}
        zIndex={10}
        width="100%"
      >
        {[...Array(2)].map((_, rowIdx) => (
          <Box key={rowIdx} display="flex">
            {[...Array(isMobile ? 13 : 40)].map((_, colIdx) => (
              <Box
                key={colIdx}
                width={isMobile ? "8vw" : "2.6vw"}
                height={isMobile ? "8vw" : "2.4vw"}
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

      {/* Left */}
      <Box
        width="60%"
        height="100%"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        position={"relative"}
        pl="8vw"
      >
        {/* Vectors */}
        {vectorsPositions.map((vector, index) => (
          <Box
            ref={vector.ref}
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
        <Box ref={textContainerRef} sx={{ transformStyle: "preserve-3d" }}>
          <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
            <Typography sx={textStyle} data-text-slide>
              Umi is
            </Typography>
          </Box>
          <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
            <Typography sx={textStyle} data-text-slide>
              so matcha
            </Typography>
          </Box>
          <Box width="100%" overflow="hidden" position="relative" zIndex={10}>
            <Typography sx={textStyle} data-text-slide>
              better
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Right */}
      <Box
        ref={rightSectionRef}
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
              <IconButton
                sx={{ color: theme.colors.green }}
                ref={prevButtonRef}
                onClick={() => handleProductChange("prev")}
              >
                <Icon component={IoIosArrowBack} fontSize="large" />
              </IconButton>
              <IconButton
                ref={nextButtonRef}
                sx={{ color: theme.colors.green }}
                onClick={() => handleProductChange("next")}
              >
                <Icon component={IoIosArrowForward} fontSize="large" />
              </IconButton>
            </Box>

            <Box mt={4} width="60%" overflow="hidden">
              <Typography
                ref={productTitleRef}
                fontFamily={theme.fonts.text}
                fontSize="1.2vw"
                fontWeight={700}
                color={theme.colors.green}
                textAlign="center"
              >
                {products[currentProductIndex].title}
              </Typography>
            </Box>
            <Box width="100%" height="60%" overflow="hidden">
              <Box
                ref={productImageRef}
                component="img"
                src={products[currentProductIndex].image}
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
              <Box sx={bottomBoxStyle} overflow="hidden">
                <Typography
                  ref={productDescriptionRef}
                  fontFamily={theme.fonts.text}
                  color={theme.colors.green}
                  fontSize=".8vw"
                  fontWeight={500}
                >
                  {products[currentProductIndex].description}
                </Typography>
              </Box>
              <Box sx={bottomBoxStyle} overflow="hidden">
                <Typography
                  ref={productPriceRef}
                  fontFamily={theme.fonts.text}
                  color={theme.colors.green}
                  fontSize=".8vw"
                  fontWeight={500}
                >
                  Price: {products[currentProductIndex].price}
                </Typography>
              </Box>
              <Box sx={bottomBoxStyle}>
                <Box
                  ref={sakuraRef}
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
