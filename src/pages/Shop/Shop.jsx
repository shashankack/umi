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
import { useLocation } from "react-router-dom";
import { fetchShopifyProducts } from "../../utils/shopify";
import { useTheme } from "@mui/material/styles";
import gsap from "gsap";

import { useNavbarTheme } from "../../context/NavbarThemeContext";

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

import limitedTag from "../../assets/images/vectors/tags/limited.png";
import bestSellerTag from "../../assets/images/vectors/tags/best_seller.png";
import mostLovedTag from "../../assets/images/vectors/tags/most_loved.png";
import slugify from "../../utils/slugify";

const Shop = () => {
  const theme = useTheme();
  const { setNavbarTheme } = useNavbarTheme();
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { addItem, updateQuantity, lineItems, removeItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = useLocation();

  const categoryRefs = useRef({});
  const marqueeRef = useRef(null);

  const features = [feature1, feature2, feature3, feature4, feature5, feature6];

  const setTags = (tags = []) => {
    const normalized = tags.map((tag) => tag.toLowerCase());

    if (
      normalized.includes("limited") ||
      normalized.includes("limited edition")
    ) {
      return limitedTag;
    }

    if (
      normalized.includes("bestseller") ||
      normalized.includes("best seller")
    ) {
      return bestSellerTag;
    }

    if (normalized.includes("mostloved") || normalized.includes("most-loved")) {
      return mostLovedTag;
    }
    return null;
  };

  const handleRedirect = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const leftButtonStyles = {
    backgroundColor: theme.colors.pink,
    color: theme.colors.beige,
    border: "none",
    padding: isMobile ? "10px 30px" : "10px 60px",
    borderRadius: "25px 0 0 25px",
    cursor: "pointer",
    fontFamily: "Stolzl",
    fontSize: isMobile ? "2vw" : ".9vw",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.colors.green,
    },
  };

  const rightButtonStyles = {
    backgroundColor: theme.colors.pink,
    color: theme.colors.beige,
    border: "none",
    width: "100%",
    padding: "10px 10px",
    borderRadius: "0 25px 25px 0",
    cursor: "pointer",
    fontFamily: "Stolzl",
  };

  const titleStyles = {
    mt: isMobile ? 4 : 7,
    mb: isMobile ? 4 : -6,
    width: "100%",
    textAlign: "center",
    fontSize: isMobile ? "10vw" : "4vw",
    fontFamily: "Genty",
    textTransform: "capitalize",
    color: theme.colors.pink,
    textShadow: `2px 2px 0 ${theme.colors.green}`,
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;
    let interval;

    const tryStart = () => {
      const marquee = marqueeRef.current;
      if (marquee && marquee.children.length) {
        clearInterval(interval);

        const totalWidth = Array.from(marquee.children).reduce(
          (acc, el) => acc + el.offsetWidth,
          0
        );

        gsap.set(marquee, { x: 0 });

        gsap.to(marquee, {
          x: `-=${totalWidth / 2}`,
          duration: 20,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % (totalWidth / 2)),
          },
        });
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }
    };

    interval = setInterval(tryStart, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
        setError(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");

    if (scrollTo && categoryRefs.current[scrollTo.toLowerCase()]) {
      setTimeout(() => {
        categoryRefs.current[scrollTo.toLowerCase()].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [location.search, products]);

  const categories = products.reduce((acc, product) => {
    const { productType } = product;
    if (!acc[productType]) {
      acc[productType] = [];
    }
    acc[productType].push(product);
    return acc;
  }, {});

  if (loading || error || products.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: theme.colors.beige,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography
          fontSize={isMobile ? "6vw" : "2vw"}
          fontFamily={theme.fonts.heading}
          color={theme.colors.pink}
        >
          {error
            ? "Oops! We couldn't load the products :("
            : "Loading the freshest matcha..."}
        </Typography>

        {error && (
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              backgroundColor: theme.colors.pink,
              color: theme.colors.beige,
              fontFamily: "Stolzl",
              fontSize: isMobile ? "4vw" : "1vw",
              px: 4,
              py: 1.5,
              borderRadius: 10,
              textTransform: "none",
            }}
          >
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.colors.beige }} overflow="hidden">
      <Box position="relative">
        {isMobile ? (
          <Box
            component="svg"
            width="500"
            height="210"
            viewBox="0 0 500 210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.8"
              d="M500 209.789C462.34 207.392 460.058 185.321 418.087 185.321C373.701 185.321 373.7 210 329.313 210C284.927 210 284.926 185.321 240.539 185.321C196.152 185.321 196.135 210 151.748 210C107.361 210 107.36 185.321 62.9736 185.321C29.3903 185.321 21.2036 199.441 0 206.315V0H500V209.789Z"
              fill="#B5D782"
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
            bottom: isMobile ? 34 : "20%",
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
                fontSize={isMobile ? "4vw" : "2vw"}
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
            ref={(el) => (categoryRefs.current["matcha"] = el)}
            id="matcha"
            mt={isMobile ? 0 : 10}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={titleStyles}>Matcha</Typography>

            <Grid
              container
              width="100%"
              columnSpacing={isMobile ? 5 : 5}
              rowSpacing={isMobile ? 5 : 15}
              display="flex"
              justifyContent="space-evenly"
              p={isMobile ? 0 : 12}
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
                    position="relative"
                  >
                    {setTags(product.tags) && (
                      <Box
                        component="img"
                        src={setTags(product.tags)}
                        alt="Product Tag"
                        sx={{
                          position: "absolute",
                          transform: "rotate(20deg)",
                          top: isMobile ? 20 : 20,
                          right: isMobile ? -20 : 40,
                          zIndex: 1,
                          width: isMobile ? "16vw" : "8vw",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <Box
                      component="h2"
                      sx={{
                        fontFamily: "Stolzl",
                        color: theme.colors.pink,
                        fontWeight: 200,
                        textAlign: "center",
                        fontSize: isMobile ? "3.6vw" : "1.6vw",
                      }}
                    >
                      {product.title}
                    </Box>
                    <Box width={isMobile ? "40vw" : "60%"}>
                      <Box
                        component="img"
                        src={product.images.edges[0]?.node.url}
                        onClick={() => {
                          window.location.href = `/shop/${slugify(
                            product.title
                          )}`;
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Box>
                    <ButtonGroup sx={{ width: isMobile ? "100%" : "auto" }}>
                      <Button
                        sx={leftButtonStyles}
                        onClick={() => {
                          window.location.href = `/shop/${slugify(
                            product.title
                          )}`;
                        }}
                      >
                        {/* ₹ {product.variants.edges[0]?.node.price.amount} */}
                        ₹ Coming soon
                      </Button>

                      {lineItem ? (
                        <Box
                          sx={{
                            backgroundColor: theme.colors.pink,
                            color: theme.colors.beige,
                            borderRadius: "0 25px 25px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                            <RemoveIcon
                              sx={{
                                fontSize: isMobile ? "4vw" : "1.4vw",
                                m: 0,
                                p: 0,
                              }}
                            />
                          </IconButton>
                          <Typography fontSize={isMobile ? "3.4vw" : "1vw"}>
                            {lineItem.quantity}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              updateQuantity(lineItem.id, lineItem.quantity + 1)
                            }
                            size="small"
                            sx={{ color: theme.colors.beige }}
                          >
                            <AddIcon
                              sx={{
                                fontSize: isMobile ? "4vw" : "1.4vw",
                                m: 0,
                                p: 0,
                              }}
                            />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          sx={rightButtonStyles}
                          // onClick={() => {
                          //   if (variantId) addItem(variantId, 1);
                          // }}
                        >
                          <ShoppingCartIcon
                            sx={{
                              fontSize: isMobile ? "4vw" : "1.2vw",
                            }}
                          />
                        </Button>
                      )}
                    </ButtonGroup>
                  </Grid>
                );
              })}
            </Grid>
            <Stack
              width={isMobile ? "90%" : "40%"}
              direction="row"
              height="10vh"
              spacing={isMobile ? 2 : 0}
              my={10}
            >
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
      <Stack spacing={6} mt={-6}>
        {["matchaware", "bundles"].map((category) =>
          categories[category] ? (
            <Box
              key={category}
              ref={(el) => (categoryRefs.current[category] = el)}
              id={category}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={titleStyles}>{category}</Typography>

              <Grid
                container
                columnSpacing={isMobile ? 5 : 5}
                rowSpacing={isMobile ? 5 : 20}
                display="flex"
                justifyContent="space-evenly"
                p={isMobile ? 0 : 12}
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
                      justifyContent="space-between"
                      flexDirection="column"
                      alignItems="center"
                      position="relative"
                      height={isMobile ? "auto" : "40vh"}
                    >
                      {setTags(product.tags) && (
                        <Box
                          component="img"
                          src={setTags(product.tags)}
                          alt="Product Tag"
                          sx={{
                            transform: "rotate(20deg)",
                            position: "absolute",
                            top: isMobile ? 20 : 20,
                            right: isMobile ? -20 : 20,
                            zIndex: 1,
                            width: isMobile ? "16vw" : "8vw",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      <Box
                        component="h2"
                        sx={{
                          fontFamily: "Stolzl",
                          color: theme.colors.pink,
                          fontWeight: 200,
                          textAlign: "center",
                          fontSize: isMobile ? "3.6vw" : "1.6vw",
                        }}
                      >
                        {product.title}
                      </Box>
                      <Box
                        width={isMobile ? "40vw" : "100%"}
                        height={isMobile ? "auto" : "100%"}
                      >
                        <Box
                          component="img"
                          src={product.images.edges[0]?.node.url}
                          onClick={() => {
                            window.location.href = `/shop/${slugify(
                              product.title
                            )}`;
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      </Box>
                      <ButtonGroup sx={{ width: isMobile ? "100%" : "auto" }}>
                        <Button
                          sx={leftButtonStyles}
                          onClick={() => {
                            window.location.href = `/shop/${slugify(
                              product.title
                            )}`;
                          }}
                        >
                          {/* ₹ {product.variants.edges[0]?.node.price.amount} */}
                          ₹ Coming Soon
                        </Button>

                        {lineItem ? (
                          <Box
                            sx={{
                              backgroundColor: theme.colors.pink,
                              color: theme.colors.beige,
                              borderRadius: "0 25px 25px 0",
                              display: "flex",
                              alignItems: "center",
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
                              <RemoveIcon
                                sx={{
                                  fontSize: isMobile ? "4vw" : "1.4vw",
                                  m: 0,
                                  p: 0,
                                }}
                              />
                            </IconButton>
                            <Typography fontSize={isMobile ? "3.4vw" : "1vw"}>
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
                              <AddIcon
                                sx={{
                                  fontSize: isMobile ? "4vw" : "1.4vw",
                                  m: 0,
                                  p: 0,
                                }}
                              />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            sx={rightButtonStyles}
                            // onClick={() => {
                            //   if (variantId) addItem(variantId, 1);
                            // }}
                          >
                            <ShoppingCartIcon
                              sx={{
                                fontSize: isMobile ? "4vw" : "1.2vw",
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

      <Box position="relative" mt={isMobile ? 6 : 10}>
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
            viewBox="0 0 1920 450"
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
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -45%)",
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
