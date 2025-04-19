import "./About.scss";

import founder from "../../assets/images/vectors/about/founder.png";
import badge from "../../assets/images/vectors/about/badge.png";

import { useTheme } from "@mui/material/styles";

import { Box, Container, Typography, Button, useMediaQuery } from "@mui/material";

import { useRef, useEffect, useState } from "react";

import gsap from "gsap";

const About = () => {
  const theme = useTheme();
  const badgeRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));  // Check for small screen sizes
  const [showMore, setShowMore] = useState(false);  // Track the "Read more" toggle state

  useEffect(() => {
    // Infinite rotation of the badge
    gsap.to(badgeRef.current, {
      rotation: 360,
      repeat: -1, // Infinite repetition
      duration: 5, // Duration for one full rotation (adjust for speed)
      ease: "none", // No easing for smooth continuous rotation
    });
  }, []);

  return (
    <Container
      maxWidth="xxl"
      sx={{
        pt: 20,
        pb: 5,
        width: "100vw",
        height: "100%",
        backgroundColor: theme.colors.green,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Typography
        fontFamily={"Genty"}
        fontSize={60}
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
      <Box
        maxWidth={"lg"}
        backgroundColor={theme.colors.beige}
        p={5}
        borderRadius={15}
        boxShadow={`6px 6px 0 ${theme.colors.pink}`}
      >
        <Typography
          fontFamily={theme.fonts.text}
          color={theme.colors.pink}
          fontSize={20}
          fontWeight={200}
          mb={3}
          textAlign="justify"
        >
          Umi
          <span
            style={{
              color: "#B5D782",
              marginInline: 10,
            }}
          >
            海
          </span>
          comes from the Japanese word ocean.
        </Typography>
        <Typography
          fontFamily={theme.fonts.text}
          color={theme.colors.pink}
          fontSize={20}
          fontWeight={200}
          mb={3}
          textAlign="justify"
        >
          The concept of Umi is inspired by the famous Japanese painting, "The
          Great Wave of Kanagawa". Matcha has been a constant in my life through
          its highest highs and lowest lows and just like that, the great wave
          depicts life's journey. It is a never-ending process where once we
          conquer our fear and meet our goal, we'll be met again with other
          vicious waves, other bigger problems & difficulties.
        </Typography>

        {/* Conditional rendering of the "Read more" content */}
        {isMobile && !showMore && (
          <Button
            variant="text"
            sx={{
              color: theme.colors.pink,
              fontFamily: theme.fonts.text,
              fontSize: 18,
              mt: 2,
              textTransform: "none",
            }}
            onClick={() => setShowMore(true)}
          >
            Read more...
          </Button>
        )}

        {showMore && (
          <Typography
            fontFamily={theme.fonts.text}
            color={theme.colors.pink}
            fontSize={20}
            fontWeight={200}
            mb={3}
            textAlign="justify"
          >
            However, our tiredness towards the journey will also have its sweetness when we
            reach a calm sea, where its wave is gentle, and we can feel the
            summer breeze warm our mind, body, and soul. But, with the knowledge
            that another wave is waiting to be conquered. Umi Matcha represents a
            symbolic shift within the matcha community.
          </Typography>
        )}

        {/* Button to collapse the expanded content */}
        {isMobile && showMore && (
          <Button
            variant="text"
            sx={{
              color: theme.colors.pink,
              fontFamily: theme.fonts.text,
              fontSize: 18,
              mt: 2,
              textTransform: "none",
            }}
            onClick={() => setShowMore(false)}
          >
            Read less...
          </Button>
        )}

        <Typography
          fontFamily={theme.fonts.text}
          color={theme.colors.pink}
          fontSize={20}
          fontWeight={200}
          mb={3}
          textAlign="justify"
        >
          Life is always better with a matcha in hand. I'm thrilled to have Umi
          become a part of your daily routine because it's truly the most
          magical part of mine.
        </Typography>
        <Typography
          fontFamily={theme.fonts.text}
          color={theme.colors.green}
          fontSize={20}
          fontWeight={200}
          alignItems="end"
          justifyContent="end"
          display="flex"
          width="100%"
          mb={3}
          textAlign="justify"
        >
          - Adviti, Founder
        </Typography>
      </Box>

      <Container
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "auto",
        }}
      >
        <Box width="350px" mt={5} component="img" src={founder} />

        <Box
          ref={badgeRef}
          component="img"
          src={badge}
          position="absolute"
          top={20}
          left={0}
          width={100}
        />
      </Container>
    </Container>
  );
};

export default About;
