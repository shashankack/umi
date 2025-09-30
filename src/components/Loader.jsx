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
      bgcolor={theme.colors?.green || "#B5D782"}
      position="fixed"
      top={0}
      left={0}
      zIndex={9999}
    >
      <Box
        component="img"
        src={nekoFace}
        alt="Loading..."
        sx={{
          width: 100,
          height: 100,
          objectFit: "contain",
          animation: `${spin} 2s linear infinite`,
          marginBottom: 2,
        }}
        onError={(e) => {
          // Fallback if image fails to load
          e.target.style.display = "none";
        }}
      />
      <Typography
        textAlign="center"
        fontFamily={theme.fonts?.text || "Arial, sans-serif"}
        color={theme.colors?.beige || "#FDF8CE"}
        fontSize={32}
        textTransform="lowercase"
        fontWeight={900}
        mt={2}
        sx={{
          userSelect: "none",
          letterSpacing: "0.05em",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
