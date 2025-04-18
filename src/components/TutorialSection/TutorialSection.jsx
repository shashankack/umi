import { Box, Typography, useTheme, useMediaQuery, Grid } from "@mui/material";

import step1 from "../../assets/images/vectors/about/step1.png";
import step2 from "../../assets/images/vectors/about/step2.png";
import step3 from "../../assets/images/vectors/about/step3.png";
import step4 from "../../assets/images/vectors/about/step4.png";

import neko from "../../assets/images/vectors/neko/neko.gif";

const TutorialSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const stepsImages = [
    {
      image: step1,
      text: "Sift 1-2 tsp of umi matcha into a bowl.",
    },
    {
      image: step2,
      text: "Add 80ml of warm water and whisk until smooth.",
    },
    {
      image: step3,
      text: "Pour milk of your choice.",
    },
    {
      image: step4,
      text: "Add sweetner of your choice.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.colors.pink,
        py: { sm: 6, md: 10 },
        px: { sm: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { sm: 6, md: 12 },
      }}
    >
      <Box
        sx={{
          width: isMobile ? "60%" : isTablet ? "80%" : "40%",
          height: isMobile ? "50px" : isTablet ? "60px" : "70px",
          backgroundColor: theme.colors.beige,
          color: theme.colors.pink,
          borderRadius: "30px",
          boxShadow: isMobile
            ? "3px 4px 0px 0px #b5d782"
            : "6px 7px 0px 0px #b5d782",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 5, sm: 5, md: 5 },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Genty",
            fontSize: isMobile
              ? "1.5rem"
              : isTablet
              ? "2rem"
              : isSmallDesktop
              ? "2.5rem"
              : isLargeDesktop
              ? "3rem"
              : "4rem",

            mt: isMobile ? "10px" : "15px",
            fontWeight: 400,
          }}
        >
          Brew it the Umi way
        </Typography>
      </Box>

      <Grid
        maxWidth={isMobile ? "200px" : "300px"}
        mt={isMobile ? 5 : 0}
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom={isMobile ? 0 : -15}
      >
        <Box
          component="img"
          src={neko}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Grid>
      <Grid container spacing={5} p={5}>
        {stepsImages.map((step, index) => (
          <Grid
            key={`step-${index}`}
            size={{
              xs: 6,
              sm: 6,
              md: 3,
            }}
          >
            <Box
              sx={{
                scale: isMobile ? 0.8 : 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textAlign: "center",
                px: { sm: 0, md: 2 },
                py: { sm: 0, md: 2 },
              }}
            >
              <Box
                component="img"
                src={step.image}
                alt={`step-${index + 1}`}
                sx={{
                  width: { xs: 130, sm: 150, md: 200 },
                  height: { xs: 130, sm: 150, md: 200 },
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  fontSize: { sm: "1.2rem", md: "1.5rem" },
                  fontFamily: "Stolzl",
                  fontWeight: 200,
                  color: theme.colors.beige,
                }}
              >
                {step.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, height: "6px", backgroundColor: "#fdf8ce" }}></Box>
        <Typography
          sx={{
            whiteSpace: "nowrap",
            fontFamily: "Stolzl",
            fontWeight: 200,
            fontSize: { sm: "1.6rem", md: "3rem" },
            color: "#fdf8ce",
          }}
        >
          video tutorial
        </Typography>
        <Box sx={{ flex: 1, height: "6px", backgroundColor: "#fdf8ce" }}></Box>
      </Box>

      <Box
        component="iframe"
        width={isMobile ? "100%" : "60%"}
        height={isMobile ? "300px" : "500px"}
        src="https://www.youtube.com/embed/13uVij4DsZk?si=OC0gX3Ow6-t2ra4z"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        p={2}
        sx={{
          borderRadius: "20px",
          bosmhadow: "-5px 10px 5px 1px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
      />
    </Box>
  );
};

export default TutorialSection;
