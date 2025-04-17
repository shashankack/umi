import { Box, Typography, useTheme, useMediaQuery, Grid } from "@mui/material";

import step1 from "../../assets/images/vectors/about/step1.png";
import step2 from "../../assets/images/vectors/about/step2.png";
import step3 from "../../assets/images/vectors/about/step3.png";
import step4 from "../../assets/images/vectors/about/step4.png";

const TutorialSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
          width: { xs: "90%", sm: 400, md: 700 },
          height: { xs: 80, sm: 100, md: 100 },
          backgroundColor: theme.colors.beige,
          color: theme.colors.pink,
          borderRadius: "30px",
          boxShadow: "6px 7px 3px 0px #b5d782",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 5, sm: 5, md: 5 },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Genty",
            fontSize: { xs: "2rem", sm: "2rem", md: "4rem" },
            mt: "15px",
            fontWeight: 400,
          }}
        >
          Brew it the Umi way
        </Typography>
      </Box>

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
