import { useTheme, Box, keyframes, Typography } from "@mui/material";

import nekoFace from "../assets/images/vectors/neko/slider_thumb.png";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Loader = () => {
  const theme = useTheme();

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgcolor={theme.colors.green}
    >
      <Box
        component="img"
        src={nekoFace}
        alt="Loading..."
        sx={{
          width: "10vw",
          objectFit: "contain",
          animation: `${spin} 2s linear infinite`,
        }}
      />
      <Typography
        textAlign="center"
        fontFamily={theme.fonts.primary}
        color={theme.colors.beige}
        fontSize="2vw"
        mt={2}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
