import "./Shop.scss";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { fetchShopifyProducts } from "../../utils/shopify";
import { useTheme } from "@mui/material/styles";
import gsap from "gsap";

import helloNeko from "../../assets/images/vectors/neko/hello.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import feature1 from "../../assets/images/vectors/matcha_features/feature_1.png";
import feature2 from "../../assets/images/vectors/matcha_features/feature_2.png";
import feature3 from "../../assets/images/vectors/matcha_features/feature_3.png";
import feature4 from "../../assets/images/vectors/matcha_features/feature_4.png";
import feature5 from "../../assets/images/vectors/matcha_features/feature_5.png";
import feature6 from "../../assets/images/vectors/matcha_features/feature_6.png";
import { useCart } from "../../context/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Shop = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const { addItem, updateQuantity, lineItems, removeItem } = useCart();

  const marqueeRef = useRef(null);

  const features = [feature1, feature2, feature3, feature4, feature5, feature6];

  useEffect(() => {
    const marquee = marqueeRef.current;

    if (!marquee) return;

    const [text1] = marquee.children;

    const totalWidth = text1.offsetWidth;

    gsap.set(marquee, { x: 0 });

    const tween = gsap.to(marquee, {
      x: `-=${totalWidth}`,
      duration: 20,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth), // seamless loop
      },
    });

    return () => tween.kill();
  }, []);

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
    <Box sx={{ backgroundColor: theme.colors.beige }} overflow="hidden">
      <Box position="relative">
        {isMobile ? (
          <Box
            component="svg"
            width="500"
            height="170"
            viewBox="0 0 500 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M500 169.829C462.34 167.888 460.058 150.023 418.087 150.022C373.701 150.023 373.7 170 329.313 170C284.927 170 284.926 150.023 240.539 150.022C196.152 150.023 196.135 170 151.748 170C107.361 170 107.36 150.023 62.9736 150.022C29.3902 150.023 21.2036 161.452 0 167.018V0H500V169.829Z"
              fill={theme.colors.green}
            />
          </Box>
        ) : (
          <Box
            component="svg"
            width="1920"
            height="400"
            viewBox="0 0 1920 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M1920 399.636C1775.38 395.503 1766.62 357.46 1605.45 357.46C1435.01 357.46 1435.01 400 1264.56 400C1094.12 400 1094.12 357.46 923.669 357.46C753.223 357.46 753.158 400 582.712 400C412.266 400 412.265 357.46 241.819 357.46C112.858 357.46 81.4224 381.799 0 393.649V0H1920V399.636Z"
              fill={theme.colors.green}
            />
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 100,
            left: 0,
            width: "100vw",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <Box
            ref={marqueeRef}
            sx={{
              display: "inline-flex",
            }}
          >
            {[...Array(2)].map((_, i) => (
              <Typography
                key={i}
                color={theme.colors.beige}
                fontSize="2vw"
                fontWeight={500}
                fontFamily={theme.fonts.text}
              >
                shop • shop • shop • shop • shop • shop • shop • shop • shop •
                shop • shop • shop • shop • shop • shop • shop • shop • shop •
                shop • shop •
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Stack for Matcha */}
      {categories["matcha"] && (
        <Stack spacing={10}>
          <Box
            mt={isMobile ? 0 : 10}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              mt={7}
              variant="h2"
              width="100%"
              textAlign="center"
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
              Matcha
            </Typography>

            <Grid
              container
              width="100%"
              columnSpacing={isMobile ? 5 : 5}
              rowSpacing={isMobile ? 5 : 15}
              display="flex"
              justifyContent="space-evenly"
              sx={{
                scale: isMobile
                  ? 1
                  : isTablet
                  ? 0.7
                  : isSmallDesktop
                  ? 0.8
                  : 0.9,
              }}
            >
              {categories["matcha"].map((product) => {
                const productId = product.id.split("/").pop();
                const variantId = product.variants.edges[0]?.node.id;
                const lineItem = lineItems.find(
                  (item) => item.merchandise.id === variantId
                );
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
                      }}
                    >
                      {product.title}
                    </Box>
                    <Box width="60%">
                      <Box
                        component="img"
                        src={product.images.edges[0]?.node.url}
                        onClick={() => {
                          window.location.href = `/product/${productId}`;
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Box>
                    <ButtonGroup>
                      <Button
                        sx={{
                          backgroundColor: theme.colors.green,
                          color: theme.colors.beige,
                          border: "none",
                          padding: "10px 60px",
                          borderRadius: "25px 0 0 25px",
                          cursor: "pointer",
                          fontFamily: "Stolzl",
                          fontSize: isMobile ? ".6rem" : ".9vw",
                          zIndex: 20,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            backgroundColor: theme.colors.pink,
                          },
                        }}
                        onClick={() => {
                          window.location.href = `/product/${productId}`;
                        }}
                      >
                        ₹ {product.variants.edges[0]?.node.price.amount}
                      </Button>

                      {lineItem ? (
                        <Box
                          sx={{
                            backgroundColor: theme.colors.pink,
                            color: theme.colors.beige,
                            borderRadius: "0 25px 25px 0",
                            display: "flex",
                            alignItems: "center",
                            px: 1,
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              if (lineItem.quantity === 1) {
                                removeItem(lineItem.id);
                              } else {
                                updateQuantity(
                                  lineItem.id,
                                  lineItem.quantity - 1
                                );
                              }
                            }}
                            size="small"
                            sx={{ color: theme.colors.beige }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>
                            {lineItem.quantity}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              updateQuantity(lineItem.id, lineItem.quantity + 1)
                            }
                            size="small"
                            sx={{ color: theme.colors.beige }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          sx={{
                            backgroundColor: theme.colors.pink,
                            color: theme.colors.beige,
                            border: "none",
                            width: "100%",
                            padding: "10px 10px",
                            borderRadius: "0 25px 25px 0",
                            cursor: "pointer",
                            fontFamily: "Stolzl",
                            zIndex: 10,
                          }}
                          onClick={() => {
                            if (variantId) addItem(variantId, 1);
                          }}
                        >
                          <ShoppingCartIcon
                            sx={{
                              fontSize: isMobile ? "1rem" : "1.2vw",
                            }}
                          />
                        </Button>
                      )}
                    </ButtonGroup>
                  </Grid>
                );
              })}
            </Grid>
            <Stack width="40%" direction="row" height="10vh" my={10}>
              {features.map((feature, index) => (
                <Box key={index} width="100%">
                  <Box
                    component="img"
                    src={feature}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      )}

      {/* Stack for Matchaware & Bundles */}
      <Stack spacing={10}>
        {["matchaware", "bundles"].map((category) =>
          categories[category] ? (
            <Box
              key={category}
              mt={isMobile ? 0 : 10}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                mt={7}
                variant="h2"
                width="100%"
                textAlign="center"
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
                sx={{ textShadow: "2px 2px 0 #B5D782" }}
              >
                {category}
              </Typography>

              <Grid
                container
                columnSpacing={isMobile ? 5 : 5}
                rowSpacing={isMobile ? 5 : 10}
                display="flex"
                justifyContent="space-evenly"
                sx={{
                  scale: isMobile
                    ? 1
                    : isTablet
                    ? 0.7
                    : isSmallDesktop
                    ? 0.8
                    : 0.9,
                }}
              >
                {categories[category].map((product) => {
                  const productId = product.id.split("/").pop();
                  const variantId = product.variants.edges[0]?.node.id;
                  const lineItem = lineItems.find(
                    (item) => item.merchandise.id === variantId
                  );
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
                      <Box width="60%">
                        <Box
                          component="img"
                          src={product.images.edges[0]?.node.url}
                          onClick={() => {
                            window.location.href = `/product/${productId}`;
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </Box>
                      <ButtonGroup>
                        <Button
                          sx={{
                            backgroundColor: theme.colors.green,
                            color: theme.colors.beige,
                            border: "none",
                            padding: "10px 60px",
                            borderRadius: "25px 0 0 25px",
                            cursor: "pointer",
                            fontFamily: "Stolzl",
                            fontSize: isMobile ? ".6rem" : ".9vw",
                            zIndex: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              backgroundColor: theme.colors.pink,
                            },
                          }}
                          onClick={() => {
                            window.location.href = `/product/${productId}`;
                          }}
                        >
                          ₹ {product.variants.edges[0]?.node.price.amount}
                        </Button>

                        {lineItem ? (
                          <Box
                            sx={{
                              backgroundColor: theme.colors.pink,
                              color: theme.colors.beige,
                              borderRadius: "0 25px 25px 0",
                              display: "flex",
                              alignItems: "center",
                              px: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                if (lineItem.quantity === 1) {
                                  removeItem(lineItem.id);
                                } else {
                                  updateQuantity(
                                    lineItem.id,
                                    lineItem.quantity - 1
                                  );
                                }
                              }}
                              size="small"
                              sx={{ color: theme.colors.beige }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>
                              {lineItem.quantity}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                updateQuantity(
                                  lineItem.id,
                                  lineItem.quantity + 1
                                )
                              }
                              size="small"
                              sx={{ color: theme.colors.beige }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            sx={{
                              backgroundColor: theme.colors.pink,
                              color: theme.colors.beige,
                              border: "none",
                              width: "100%",
                              padding: "10px 10px",
                              borderRadius: "0 25px 25px 0",
                              cursor: "pointer",
                              fontFamily: "Stolzl",
                              zIndex: 10,
                            }}
                            onClick={() => {
                              if (variantId) addItem(variantId, 1);
                            }}
                          >
                            <ShoppingCartIcon
                              sx={{
                                fontSize: isMobile ? "1rem" : "1.2vw",
                              }}
                            />
                          </Button>
                        )}
                      </ButtonGroup>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : null
        )}
      </Stack>

      <Box position="relative">
        {isMobile ? (
          <Box
            component="svg"
            width="500"
            height="203"
            viewBox="0 0 500 203"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M348.252 0C392.639 0.000101658 392.64 20.2128 437.026 20.2129C470.61 20.2128 478.796 8.64819 500 3.01758V203H0V0.172852C37.6601 2.13636 39.9421 20.2128 81.9131 20.2129C126.299 20.2127 126.3 0.000179083 170.687 0C215.073 8.91315e-06 215.074 20.2128 259.461 20.2129C303.848 20.2128 303.865 0.000119497 348.252 0Z"
              fill={theme.colors.pink}
            />
          </Box>
        ) : (
          <Box
            component="svg"
            width="1920"
            height="100%"
            viewBox="0 0 1920 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M1920 0.545898C1775.38 6.74459 1766.62 63.8095 1605.45 63.8096C1435.01 63.8096 1435.01 -0.000976562 1264.56 -0.000976562C1094.12 -0.000976562 1094.12 63.8096 923.669 63.8096C753.223 63.8095 753.158 -0.000976562 582.712 -0.000976562C412.266 -0.000900393 412.265 63.8096 241.819 63.8096C112.858 63.8095 81.4224 27.301 0 9.52539V600H1920V0.545898Z"
              fill={theme.colors.pink}
            />
          </Box>
        )}

        <Box
          position="absolute"
          sx={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Box width={isMobile ? "16vw" : "8vw"}>
            <Box
              component="img"
              src={helloNeko}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            color={theme.colors.beige}
            fontFamily={theme.fonts.text}
            fontWeight={600}
            fontSize={isMobile ? "3vw" : "1.6vw"}
            textAlign="center"
          >
            Matcha your flow <br />
            Shipping worldwide!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Shop;

{
  /* <Box ml="-5%">
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
            </Box> */
}
{
  /* <Box mr="-5%">
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
            </Box> */
}
