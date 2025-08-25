import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import neko from "../assets/images/vectors/neko/faq.png";
import { useEffect } from "react";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import Footer from "../components/Footer";

const FAQRenderer = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setNavbarTheme } = useNavbarTheme();
  useEffect(() => {
    document.title = "FAQ - Umi Matcha Shop";
    setNavbarTheme("beige");
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.colors.green,
          minHeight: "100vh",
          py: 12,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box maxWidth={isMobile ? 200 : 300} my={isMobile ? 2 : 10}>
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
        {data.map((topic, index) => (
          <Accordion
            key={index}
            sx={{
              maxWidth: 1200,
              width: "100%",
              backgroundColor: theme.colors.beige,
              borderRadius: 2,
              boxShadow: `4px 4px 0 ${theme.colors.pink}`,
              mb: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: theme.colors.pink }} />}
            >
              <Typography
                fontSize={isMobile ? "4vw" : "1.6vw"}
                fontWeight={800}
                fontFamily={theme.fonts.text}
                color={theme.colors.pink}
              >
                {topic.topic}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {topic.type === "faq" ? (
                topic.content.map((item, idx) => (
                  <Accordion
                    key={idx}
                    sx={{
                      backgroundColor: theme.colors.beige,
                      mb: 1,
                      border: `3px solid ${theme.colors.green}`,
                      borderRadius: 2,
                      boxShadow: `2px 2px 0 ${theme.colors.green}`,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: theme.colors.green }} />
                      }
                    >
                      <Typography
                        fontSize={isMobile ? "3.5vw" : "1.4vw"}
                        sx={{ color: theme.colors.pink, fontWeight: 500 }}
                      >
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        component="div"
                        fontSize={isMobile ? "3vw" : "1.2vw"}
                        sx={{
                          color: theme.colors.green,
                          mt: -2,
                          "& ul": {
                            paddingLeft: isMobile ? "5vw" : "2vw",
                            mt: -2,
                            listStyleType: "disc",
                          },
                          "& .pinky": {
                            color: theme.colors.pink,
                          },
                        }}
                      >
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography
                  component="div"
                  sx={{
                    color: theme.colors.green,
                    fontSize: isMobile ? "3vw" : "1.2vw",
                    "& .pinky": {
                      color: theme.colors.pink,
                    },
                    "& ul": {
                      paddingLeft: isMobile ? "5vw" : "2vw",
                      mt: -2,
                      listStyleType: "disc",
                    },
                  }}
                >
                  {topic.answer}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default FAQRenderer;
