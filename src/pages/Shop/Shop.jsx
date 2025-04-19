import "./Shop.scss";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { fetchShopifyProducts } from "../../utils/shopify";
import { useTheme } from "@mui/material/styles";

import shopBg from "../../assets/images/shop_bg.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Shop = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  const generateSquares = (
    width,
    height,
    rows,
    cols,
    color1,
    color2,
    flipped = false
  ) => {
    const squares = [];
    const squareWidth = width;
    const squareHeight = height;

    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, ${squareWidth}px)`,
      gridTemplateRows: `repeat(${rows}, ${squareHeight}px)`,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    };

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const rowIndex = flipped ? rows - 1 - i : i;
        const colIndex = flipped ? cols - 1 - j : j;

        const isEven = (rowIndex + colIndex) % 2 === 0;
        const squareColor = isEven ? color1 : color2;

        squares.push(
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: `${squareWidth}px`,
              height: `${squareHeight}px`,
              backgroundColor: squareColor,
              boxSizing: "border-box",
            }}
          />
        );
      }
    }

    return <div style={gridStyle}>{squares}</div>;
  };

  const categories = products.reduce((acc, product) => {
    const { productType } = product;
    if (!acc[productType]) {
      acc[productType] = [];
    }
    acc[productType].push(product);
    return acc;
  }, {});

  return (
    <Box
      sx={{ backgroundColor: theme.colors.beige }}
      overflow="hidden"
      py={isMobile ? 5 : 0}
    >
      {Object.keys(categories).map((category) => (
        <Box
          key={category}
          mt={isMobile ? 0 : 10}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box ml="-5%">
              {generateSquares(
                isMobile ? 20 : 40,
                isMobile ? 20 : 40,
                2,
                isMobile
                  ? 6
                  : isTablet
                  ? 6
                  : isSmallDesktop
                  ? 8
                  : isLargeDesktop
                  ? 10
                  : 20,
                theme.colors.green,
                theme.colors.beige
              )}
            </Box>
            <Typography
              mt={7}
              variant="h2"
              fontSize={
                isMobile
                  ? "2rem"
                  : isTablet
                  ? "3rem"
                  : isSmallDesktop
                  ? "4rem"
                  : "5rem"
              }
              fontFamily="Genty"
              textTransform="capitalize"
              color={theme.colors.pink}
              sx={{ marginBottom: 6, textShadow: "2px 2px 0 #B5D782" }}
            >
              {category}
            </Typography>
            <Box mr="-5%">
              {generateSquares(
                isMobile ? 20 : 40,
                isMobile ? 20 : 40,
                2,
                isMobile
                  ? 6
                  : isTablet
                  ? 6
                  : isSmallDesktop
                  ? 8
                  : isLargeDesktop
                  ? 10
                  : 20,
                theme.colors.green,
                theme.colors.beige,
                true
              )}
            </Box>
          </Box>

          <Grid
            container
            columnSpacing={isMobile ? 5 : 5}
            rowSpacing={isMobile ? 5 : 15}
            display="flex"
            justifyContent="space-evenly"
            sx={{
              scale: isMobile ? 1 : isTablet ? 0.7 : isSmallDesktop ? 0.8 : 0.9,
            }}
          >
            {categories[category].map((product) => {
              const productId = product.id.split("/").pop();

              return (
                <Grid
                  size={isMobile ? 5 : 4}
                  key={product.id}
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    component="h2"
                    style={{
                      fontFamily: "Stolzl",
                      color: theme.colors.pink,
                      fontWeight: 200,
                      textAlign: "center",
                      fontSize: isMobile ? "1.2rem" : "1.6rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {product.title}
                  </Box>
                  <Box
                    component="img"
                    src={product.images.edges[0]?.node.url}
                    onClick={() => {
                      window.location.href = `/product/${productId}`;
                    }}
                    sx={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",

                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    justifyContent="space-around"
                    alignItems="center"
                    gap={isMobile ? 0.5 : 5}
                  >
                    <Button
                      style={{
                        backgroundColor: theme.colors.green,
                        color: theme.colors.beige,
                        border: "none",
                        padding: "5px 50px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontFamily: "Stolzl",
                        fontSize: isMobile ? ".6rem" : ".9rem",
                        textWrap: "nowrap",
                        zIndex: 10,
                      }}
                      onClick={() => {
                        window.location.href = `/product/${productId}`;
                      }}
                    >
                      ₹ {product.variants.edges[0]?.node.price.amount}
                    </Button>
                    <Button
                      style={{
                        backgroundColor: theme.colors.pink,
                        color: theme.colors.beige,
                        border: "none",
                        width: "100%",
                        padding: "10px 30px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontFamily: "Stolzl",
                        zIndex: 10,
                      }}
                    >
                      <ShoppingCartIcon
                        sx={{
                          fontSize: isMobile ? "1rem" : "1rem",
                        }}
                      />
                    </Button>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default Shop;
