import { Stack, useTheme, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  privacyPolicy,
  termsOfService,
  refundPolicy,
  shippingPolicy,
} from "../assets/policies";

// Centralized policy map – scalable and clean
const policyMap = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "refund-policy": refundPolicy,
  "shipping-policy": shippingPolicy,
};

const LegalPolicy = () => {
  const theme = useTheme();
  const location = useLocation();

  const path = location.pathname.split("/").pop();
  const policyData = policyMap[path] || privacyPolicy;

  return (
    <Stack
      bgcolor={theme.colors.beige}
      py={20}
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        sx={{
          fontFamily: theme.fonts.text,
          color: theme.colors.pink,
          fontWeight: 700,
          marginBottom: "1rem",
          textAlign: "center",
          fontSize: "3vw",
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
                fontSize: "1.4vw",
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
                fontSize: "1vw",
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
  );
};

export default LegalPolicy;
