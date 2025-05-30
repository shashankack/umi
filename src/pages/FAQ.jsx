import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQRenderer = ({ data }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.colors.green,
        minHeight: "100vh",
        py: 12,
        px: 3,
      }}
    >
      {data.map((topic, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: theme.colors.beige,
            border: `2px solid ${theme.colors.pink}`,
            borderRadius: 2,
            boxShadow: "none",
            mb: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: theme.colors.pink }} />}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
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
                    border: `1px solid ${theme.colors.green}`,
                    mb: 1,
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ color: theme.colors.green }} />
                    }
                  >
                    <Typography
                      variant="h5"
                      sx={{ color: theme.colors.pink, fontWeight: 500 }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="h6" sx={{ color: theme.colors.green }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography component="div" sx={{ color: theme.colors.green }}>
                {topic.answer}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQRenderer;
