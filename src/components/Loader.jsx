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
      minHeight="100vh"
      width="100%"
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
          width: 100,
          objectFit: "contain",
          animation: `${spin} 2s linear infinite`,
        }}
      />
      <Typography
        textAlign="center"
        fontFamily={theme.fonts.text}
        color={theme.colors.beige}
        fontSize={32}
        textTransform="lowercase"
        fontWeight={900}
        mt={2}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
