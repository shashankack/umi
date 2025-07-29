import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor libraries
          vendor: ["react", "react-dom"],
          ui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          animations: ["gsap", "swiper"],
          icons: ["react-icons"],
          router: ["react-router-dom"],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Compress assets
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "gsap",
      "swiper",
    ],
  },
});
