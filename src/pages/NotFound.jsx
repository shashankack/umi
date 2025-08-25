import React, { useEffect } from "react";
import { Stack, Box, Link, Typography, useTheme } from "@mui/material";
import { useNavbarTheme } from "../context/NavbarThemeContext";

const NotFound = () => {
  const theme = useTheme();
  const { setNavbarTheme } = useNavbarTheme();

  useEffect(() => {
    setNavbarTheme("pink");
  }, [setNavbarTheme]);

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.colors.beige,
        color: theme.colors.pink,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 4, md: 0 },
      }}
    >
      <Box
        component="img"
        src="/images/vectors/not_found.png"
        sx={{ width: { xs: "40vw", md: "20vw" }, height: "auto" }}
      />
      <Stack
        alignItems={{ xs: "center", md: "start" }}
        justifyContent={{
          xs: "center",
          md: "start",
        }}
        ml={{ xs: 0, md: 10 }}
        gap={{ xs: 2, md: 4 }}
      >
        <Typography
          sx={{
            lineHeight: 0.8,
            fontFamily: theme.fonts.title,
            fontSize: { xs: "12vw", md: "5vw" },

            "& span": { fontFamily: theme.fonts.text },
          }}
        >
          Error <span>404</span>
        </Typography>
        <Typography
          sx={{
            fontFamily: theme.fonts.text,
            color: theme.colors.green,
            textTransform: "capitalize",
            fontSize: { xs: "6vw", md: "2vw" },
          }}
        >
          matcha not found
        </Typography>
        <Link
          underline="none"
          href="/"
          sx={{
            textTransform: "uppercase",
            fontFamily: theme.fonts.text,
            color: theme.colors.beige,
            fontSize: { xs: "4vw", md: "1vw" },
            bgcolor: theme.colors.pink,
            transition: "all 0.3s ease",
            borderRadius: 1,
            padding: "12px 24px",

            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          Go home
        </Link>
      </Stack>
    </Stack>
  );
};

export default NotFound;
