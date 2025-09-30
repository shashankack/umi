import { Stack, useTheme, Typography, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  privacyPolicy,
  termsOfService,
  refundPolicy,
  shippingPolicy,
} from "../assets/policies";

import Footer from "../components/Footer";
import { SEO, useSEO } from "../components/SEO";

// Centralized policy map – scalable and clean
const policyMap = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "refund-policy": refundPolicy,
  "shipping-policy": shippingPolicy,
};

const LegalPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const path = location.pathname.split("/").pop();
  const policyData = policyMap[path] || privacyPolicy;
  
  // Get SEO data for the specific policy page
  const seoData = useSEO(location.pathname);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        type={seoData.type}
      />
      <Stack
        bgcolor={theme.colors.beige}
        pt={isMobile ? 14 : 20}
        pb={isMobile ? 0 : 4}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: theme.fonts.text,
            color: theme.colors.pink,
            fontWeight: 700,
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: isMobile ? "6vw" : "3vw",
          }}
        >
          {policyData.title}
        </Typography>

        <Stack>
          {policyData.sections.map((section, index) => (
            <Stack key={index} mb={4} maxWidth="1600px" px={2}>
              <Typography
                sx={{
                  fontFamily: theme.fonts.text,
                  fontWeight: 700,
                  fontSize: isMobile ? "4vw" : "1.4vw",
                  color: theme.colors.pink,
                  marginBottom: "0.5rem",
                }}
              >
                {section.heading}
              </Typography>
              <Typography
                sx={{
                  textAlign: "justify",
                  lineHeight: "1.3",
                  fontFamily: theme.fonts.text,
                  fontSize: isMobile ? "3vw" : "1vw",
                  color: theme.colors.green,

                  "& table": {
                    width: "100%",
                    border: `4px solid ${theme.colors.pink}`,
                    borderRadius: "8px",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",

                    "& th, & td": {
                      width: "50%",
                      border: `1px solid ${theme.colors.pink}`,
                      padding: "0.5rem",
                    },

                    "& th": {
                      color: theme.colors.beige,
                      backgroundColor: theme.colors.green,
                      textAlign: "center",
                    },
                  },

                  "& strong": {
                    color: theme.colors.pink,
                    fontWeight: 600,
                  },

                  "& ul": {
                    listStyleType: "disc",
                    paddingLeft: "3rem",
                    marginBottom: "1rem",
                  },

                  "& a": {
                    color: theme.colors.pink,
                    textDecoration: "underline",
                    transition: "color 0.3s ease",

                    "&:hover": {
                      color: theme.colors.green,
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Footer />
    </>
  );
};

export default LegalPolicy;
