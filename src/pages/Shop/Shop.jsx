import "./Shop.scss";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { fetchShopifyProducts } from "../../utils/shopify";
import { useTheme } from "@mui/material/styles";

const Shop = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);

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

  const categories = products.reduce((acc, product) => {
    const { productType } = product;
    if (!acc[productType]) {
      acc[productType] = [];
    }
    acc[productType].push(product);
    return acc;
  }, {});

  return (
    <Box sx={{ padding: 4, backgroundColor: theme.colors.beige }}>
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
          <Typography
            variant="h2"
            fontFamily="Genty"
            textTransform="capitalize"
            color={theme.colors.pink}
            sx={{ marginBottom: 6, textShadow: "2px 2px 0 #B5D782" }}
          >
            {category}
          </Typography>

          <Grid
            container
            spacing={4}
            width={"100%"}
            display="flex"
            justifyContent="space-evenly"
          >
            {categories[category].map((product) => {
              const productId = product.id.split("/").pop();

              return (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Box
                    height="300px"
                    width="300px"
                    zIndex={2}
                    sx={{
                      borderRadius: 2,
                      boxShadow: `4px 4px 0 0 #B5D782`,
                      backgroundColor: "#fff",
                      textAlign: "center",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease",

                      "&:hover": {
                        scale: 0.98,
                      },

                      "&:hover .product-title": {
                        transform: "translateY(0)",
                      },

                      "& img": {
                        transform: "scale(1.1)",
                        transition: "all 0.3s ease",

                        "&:hover": {
                          transform: "scale(1)",
                          filter: "blur(2px)",
                        },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={product.images.edges[0]?.node.url}
                      onClick={() => {
                        window.location.href = `/product/${productId}`;
                      }}
                      alt={product.title}
                      sx={{
                        overflow: "hidden",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                      }}
                    />
                    <Typography
                      variant="h6"
                      className="product-title"
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      zIndex={1}
                      color={theme.colors.beige}
                      fontWeight={600}
                      textAlign="center"
                      sx={{
                        transform: "translateY(100%)",
                        transition: "transform 0.3s ease",
                        backdropFilter: "blur(5px)",
                        backgroundColor: "#B5D782",
                      }}
                    >
                      {product.title}
                    </Typography>
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
