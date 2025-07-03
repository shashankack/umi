import "./Contact.scss";
import { useTheme } from "@mui/material/styles";
import callingNeko from "../../assets/images/vectors/neko/calling.png";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isMac = window.innerHeight <= 850;

  return (
    <Box
      width="100%"
      height="100vh"
      py={isMobile ? 10 : 0}
      sx={{ background: theme.colors.green }}
      display="flex"
      alignItems="center"
      justifyContent={isMobile ? "end" : "center"}
      flexDirection="column"
    >
      <Typography
        color={theme.colors.beige}
        fontFamily={"Genty"}
        fontSize={isMobile ? "12vw" : "4.6vw"}
        fontWeight={400}
        mt={isMobile ? 4 : isMac ? 10 : 0}
        sx={{
          textShadow: `4px 4px 0  ${theme.colors.pink}`,
        }}
      >
        Contact us
      </Typography>

      <Grid
        backgroundColor={theme.colors.beige}
        boxShadow={`4px 4px 0  ${theme.colors.pink}`}
        borderRadius={12}
        container
        maxWidth={isMobile ? "90%" : isTablet ? "90%" : "60%"}
        maxHeight={isMobile ? "100%" : 500}
        height="100%"
        mb={isMobile ? 5 : isSmallDesktop ? 20 : 0}
      >
        <Grid
          size={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={70}
        >
          <Typography
            fontFamily={theme.fonts.text}
            color={theme.colors.pink}
            fontWeight={400}
            fontSize={isMobile ? 20 : 30}
            mt={isMobile ? 10 : 6}
            width={"80%"}
            textAlign="center"
          >
            Your Matcha Moments Matter to us
          </Typography>
        </Grid>
        <Box
          display="flex"
          width="100%"
          height="80%"
          flexDirection={isMobile ? "column-reverse" : "row"}
          justifyContent="space-around"
          alignItems={isMobile ? "start" : ""}
        >
          <Grid size={isMobile ? 12 : 6}>
            <Stack
              mt={isMobile ? -6 : 0}
              gap={isMobile ? 2 : 4}
              padding={isMobile ? 1 : 5}
              alignItems={isMobile ? "center" : "start"}
              justifyContent="center"
              height="100%"
            >
              <Button
                sx={{
                  padding: "5px 30px",
                  backgroundColor: theme.colors.pink,
                  color: theme.colors.beige,
                  borderRadius: 3,
                  fontFamily: theme.fonts.text,
                  fontWeight: 400,
                  textTransform: "none",
                  boxShadow: `4px 6px 0  ${theme.colors.green}`,
                  fontSize: isMobile ? 14 : 20,
                  transition: "all .3s ease",

                  "&:hover": {
                    backgroundColor: theme.colors.pink,
                    color: theme.colors.beige,
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => {
                  window.location.href = "https://wa.me/9568480048";
                }}
              >
                +91 9568480048
              </Button>
              <Button
                sx={{
                  padding: "5px 30px",
                  backgroundColor: theme.colors.pink,
                  color: theme.colors.beige,
                  borderRadius: 3,
                  fontFamily: theme.fonts.text,
                  fontWeight: 400,
                  textTransform: "none",
                  boxShadow: `4px 6px 0  ${theme.colors.green}`,
                  fontSize: isMobile ? 14 : 20,
                  transition: "all .3s ease",

                  "&:hover": {
                    backgroundColor: theme.colors.pink,
                    color: theme.colors.beige,
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => {
                  window.open(
                    "https://www.instagram.com/umimatchaclub/",
                    "_blank"
                  );
                }}
              >
                @umimatchaclub
              </Button>
              <Button
                sx={{
                  padding: "5px 30px",
                  backgroundColor: theme.colors.pink,
                  color: theme.colors.beige,
                  borderRadius: 3,
                  fontFamily: theme.fonts.text,
                  fontWeight: 400,
                  textTransform: "none",
                  boxShadow: `4px 6px 0  ${theme.colors.green}`,
                  fontSize: isMobile ? 14 : 20,
                  transition: "all .3s ease",

                  "&:hover": {
                    backgroundColor: theme.colors.pink,
                    color: theme.colors.beige,
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => {
                  window.location.href = "mailto:hello@umimatchashop.com";
                }}
              >
                hello@umimatchashop.com
              </Button>
            </Stack>
          </Grid>
          <Grid
            size={isMobile ? 12 : 6}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box width={isMobile ? "40%" : "100%"} height={"80%"}>
              <Box
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={callingNeko}
              />
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default Contact;
