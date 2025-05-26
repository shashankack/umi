import { Stack, useTheme, Typography } from "@mui/material";
import { privacyPolicy } from "../../assets/policies/privacyPolicy";

const PrivacyPolicy = () => {
  const theme = useTheme();

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
        {privacyPolicy.title}
      </Typography>

      <Stack>
        {privacyPolicy.sections.map((section, index) => (
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
                  },

                  "& th": {
                    color: theme.colors.beige,
                    bgcolor: theme.colors.green,
                    padding: "0.5rem",
                    border: `4px solid ${theme.colors.pink}`,
                    textAlign: "center",
                  },
                  "& td": {
                    border: `4px solid ${theme.colors.pink}`,
                    padding: "0.5rem",
                    borderBottom: `1px solid ${theme.colors.pink}`,
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

export default PrivacyPolicy;
