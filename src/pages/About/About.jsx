import founder from "../../assets/images/vectors/about/founder.png";
import badge from "../../assets/images/vectors/about/badge.png";

import { Helmet } from "react-helmet-async";

import { useTheme } from "@mui/material/styles";

import { Box, Stack, Typography, useMediaQuery } from "@mui/material";

import { useRef, useEffect, useState } from "react";

import gsap from "gsap";

const About = () => {
  const theme = useTheme();
  const badgeRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // Ensure ref exists before setting up animation
    if (!badgeRef.current) {
      return;
    }

    const animation = gsap.to(badgeRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 5,
      ease: "none",
    });

    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, []);

  return (
    <Stack bgcolor={theme.colors.green} minHeight="100vh" pb={5}>
      <Helmet prioritizeSeoTags>
        <title>Japanese Matcha | Umi – Authentic Matcha Powder in India</title>
        <meta
          name="description"
          content=" Discover Umi’s story of bringing authentic Japanese matcha to India. Premium, single-origin matcha powder for purity, taste & wellness."
        />
        <meta
          name="keywords"
          content="Japanese Matcha, Umi, Authentic Matcha Powder, Best Matcha Powder in India, Umi Matcha"
        />
      </Helmet>
      <Typography
        mt={isMobile ? 14 : 18}
        fontFamily={"Genty"}
        fontSize={isMobile ? "12vw" : "4vw"}
        fontWeight={200}
        color={theme.colors.beige}
        sx={{
          textShadow: `3px 3px 0px ${theme.colors.pink}`,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        About us
      </Typography>
      <Stack
        gap={0}
        display="flex"
        alignItems="center"
        justifyContent="space-evenly"
        flexDirection={isMobile ? "column-reverse" : "row"}
      >
        <Box
          width={isMobile ? "100vw" : "50vw"}
          backgroundColor={theme.colors.green}
          px={isMobile ? 3 : 5}
          borderRadius={5}
          boxShadow={`4px 4px 0 ${theme.colors.green}`}
        >
          <Typography
            fontFamily={theme.fonts.text}
            color={theme.colors.beige}
            fontSize={isMobile ? "3vw" : "1vw"}
            fontWeight={200}
            mb={3}
            textAlign="justify"
          >
            Umi
            <span
              style={{
                color: theme.colors.beige,
                marginInline: 10,
              }}
            >
              海
            </span>
            comes from the Japanese word ocean.
          </Typography>
          <Typography
            fontFamily={theme.fonts.text}
            color={theme.colors.beige}
            fontSize={isMobile ? "3vw" : "1vw"}
            fontWeight={200}
            mb={3}
            textAlign="justify"
          >
            The concept of Umi is inspired by the famous Japanese painting, "The
            Great Wave of Kanagawa". Matcha has been a constant in my life
            through its highest highs and lowest lows and just like that, the
            great wave depicts life's journey. It is a never-ending process
            where once we conquer our fear and meet our goal, we'll be met again
            with other vicious waves, other bigger problems & difficulties.
          </Typography>

          {isMobile ? (
            <>
              {!showMore && (
                <Typography
                  onClick={() => setShowMore(true)}
                  sx={{
                    mt: -2,
                    fontSize: "3vw",
                    color: theme.colors.pink,
                    fontFamily: theme.fonts.text,
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  Read more...
                </Typography>
              )}

              <Box
                sx={{
                  maxHeight: showMore ? "1000px" : "0px",
                  opacity: showMore ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.6s ease",
                }}
              >
                <Typography
                  fontFamily={theme.fonts.text}
                  color={theme.colors.beige}
                  fontSize="3vw"
                  fontWeight={200}
                  textAlign="justify"
                  mb={3}
                >
                  However, our tiredness towards the journey will also have its
                  sweetness when we reach a calm sea, where its wave is gentle,
                  and we can feel the summer breeze warm our mind, body, and
                  soul. But, with the knowledge that another wave is waiting to
                  be conquered. Umi Matcha represents a symbolic shift within
                  the matcha community.
                  <br />
                  <br />
                  Life is always better with a matcha in hand. I'm thrilled to
                  have Umi become a part of your daily routine because it's
                  truly the most magical part of mine.
                </Typography>
              </Box>
            </>
          ) : (
            // Desktop version remains unchanged
            <Typography
              fontFamily={theme.fonts.text}
              color={theme.colors.beige}
              fontSize="1vw"
              fontWeight={200}
              textAlign="justify"
              mb={3}
            >
              However, our tiredness towards the journey will also have its
              sweetness when we reach a calm sea, where its wave is gentle, and
              we can feel the summer breeze warm our mind, body, and soul. But,
              with the knowledge that another wave is waiting to be conquered.
              Umi Matcha represents a symbolic shift within the matcha
              community.
              <br />
              <br />
              Life is always better with a matcha in hand. I'm thrilled to have
              Umi become a part of your daily routine because it's truly the
              most magical part of mine.
            </Typography>
          )}

          <Typography
            fontFamily={theme.fonts.text}
            color={theme.colors.beige}
            fontSize={isMobile ? "3vw" : "1vw"}
            fontWeight={200}
            alignItems="end"
            justifyContent="end"
            display="flex"
            width="100%"
            textAlign="justify"
          >
            - Adviti, Founder
          </Typography>
        </Box>

        <Box
          width={isMobile ? "80vw" : "26vw"}
          height="100%"
          position="relative"
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            component="img"
            src={founder}
          />

          <Box
            ref={badgeRef}
            component="img"
            src={badge}
            position="absolute"
            top={-20}
            left={-20}
            width={isMobile ? "20vw" : "8vw"}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default About;
