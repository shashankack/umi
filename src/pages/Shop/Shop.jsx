import "./Shop.scss";
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { fetchShopifyProducts } from "../../utils/shopify";
import { useTheme } from "@mui/material/styles";

import shopBg from "../../assets/images/shop_bg.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Shop = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [isMobile] = useState(window.innerWidth <= 768 ? true : false);

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
      sx={{ padding: 1, backgroundColor: theme.colors.pink }}
      overflow="hidden"
    >
      {Object.keys(categories).map((category) => (
        <Box
          key={category}
          sx={{ marginBottom: 4 }}
          mt={15}
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
            <Box
              ml={{
                xs: "-15%",
                sm: "-10%",
                md: "-5%",
              }}
            >
              {generateSquares(
                40,
                40,
                2,
                15,
                theme.colors.green,
                theme.colors.beige
              )}
            </Box>
            <Typography
              mt={6}
              variant="h2"
              fontFamily="Genty"
              textTransform="capitalize"
              color={theme.colors.beige}
              sx={{ marginBottom: 6, textShadow: "2px 2px 0 #B5D782" }}
            >
              {category}
            </Typography>
            <Box
              mr={{
                xs: "-15%",
                sm: "-10%",
                md: "-5%",
              }}
            >
              {generateSquares(
                40,
                40,
                2,
                15,
                theme.colors.green,
                theme.colors.beige,
                true
              )}
            </Box>
          </Box>

          <Grid
            container
            spacing={4}
            width="100%"
            display="flex"
            justifyContent="space-evenly"
          >
            {categories[category].map((product) => {
              const productId = product.id.split("/").pop();

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={product.id}
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box component="img" src={shopBg} />
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                    zIndex={10}
                    p={5}
                    overflow={"hidden"}
                  >
                    <Box
                      component="h2"
                      style={{
                        fontFamily: "Stolzl",
                        color: theme.colors.pink,
                        textAlign: "center",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {product.title}
                    </Box>
                    <Box
                      component="img"
                      src={product.images.edges[0]?.node.url}
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
                    <Stack direction={"row"} gap={5}>
                      <Button
                        style={{
                          backgroundColor: theme.colors.green,
                          color: theme.colors.beige,
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontFamily: "Stolzl",
                          fontSize: "1rem",
                          zIndex: 10,
                        }}
                        onClick={() => {
                          window.location.href = `/product/${productId}`;
                        }}
                      >
                        Product Info
                      </Button>
                      <Button
                        style={{
                          backgroundColor: theme.colors.green,
                          color: theme.colors.beige,
                          border: "none",
                          padding: "10px 30px",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontFamily: "Stolzl",
                          fontSize: "1rem",
                          zIndex: 10,
                        }}
                      >
                        <ShoppingCartIcon sx={{ color: theme.colors.beige }} />
                      </Button>
                    </Stack>
                  </Box>
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
