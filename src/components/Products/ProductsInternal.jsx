import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchShopifyProducts } from "../../utils/shopify";

import sliderThumb from "../../assets/images/vectors/neko/slider_thumb.png";

import {
  Box,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  useMediaQuery,
  Slider,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaShoppingCart } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/scrollbar";
import Loading from "../Loading/Loading";

import pageFold from "../../assets/images/vectors/paper_fold.png";

const ProductsInternal = () => {
  const theme = useTheme();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.title} to the cart.`);
  };

  const parsedParagraphs = useMemo(() => {
    if (!product?.descriptionHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const paragraphs = doc.querySelectorAll("p.description");

    return Array.from(paragraphs).map((p, i) => (
      <Typography
        key={i}
        gutterBottom
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 200,
          textAlign: "justify",
          fontSize: isMobile ? "0.7rem" : "1.1rem",
          mb: 2,
        }}
      >
        {p.textContent}
      </Typography>
    ));
  }, [product?.descriptionHtml, theme.fonts.text]);

  const parsedAttributes = useMemo(() => {
    if (!product?.descriptionHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const attributes = doc.querySelectorAll("ul.attributes li");

    return Array.from(attributes).map((li, i) => (
      <Typography
        key={i}
        gutterBottom
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 200,
          textAlign: "justify",
          fontSize: isMobile ? "0.7rem" : "1.4rem",
        }}
      >
        {li.textContent}
      </Typography>
    ));
  }, [product?.descriptionHtml, theme.fonts.text]);

  const parsedHighlightedAttributes = useMemo(() => {
    if (!product?.descriptionHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const attributes = doc.querySelectorAll("ul.highlighted-attributes li");

    console.log(
      "Parsed highlighted attributes:",
      Array.from(attributes).map((li) => li.textContent)
    );
    return Array.from(attributes).map((li, i) => (
      <Box key={i} mb={2} gap={2}>
        <Typography
          sx={{
            color: theme.colors.pink,
            backgroundColor: theme.colors.beige,
            fontSize: isMobile ? "0.7rem" : "1.4rem",

            p: `10px 20px`,
            borderRadius: 3,
            boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
            fontFamily: theme.fonts.text,
            fontWeight: 200,
            textAlign: "justify",
          }}
        >
          {li.textContent}
        </Typography>
      </Box>
    ));
  }, [product?.descriptionHtml, theme.fonts.text]);

  const parsedProductProfile = useMemo(() => {
    if (!product?.descriptionHtml) return { left: [], right: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const rows = doc.querySelectorAll("table.product-profile tr");

    const left = [];
    const right = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 2) {
        left.push(cells[0].textContent.trim());
        right.push(cells[1].textContent.trim());
      }
    });

    return { left, right };
  }, [product?.descriptionHtml]);

  // Memoizing the parsed tasting-notes table (for right grid)
  const parsedTastingNotes = useMemo(() => {
    if (!product?.descriptionHtml) return { left: [], right: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const rows = doc.querySelectorAll("table.tasting-notes tr");

    const left = [];
    const right = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 2) {
        left.push(cells[0].textContent.trim());
        right.push(cells[1].textContent.trim());
      }
    });

    return { left, right };
  }, [product?.descriptionHtml]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchShopifyProducts();
        const fullProductId = `gid://shopify/Product/${productId}`;
        const foundProduct = data.find((p) => p.id === fullProductId);
        setProduct(foundProduct);
        console.log("Incoming product data:", foundProduct); // Log the incoming data
        setSelectedImage(foundProduct.images.edges[0]?.node.url);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) return <Loading />;

  return (
    <Box
      sx={{
        height: window.innerWidth <= 1200 ? "110vh" : "100%",
        backgroundColor: theme.colors.beige,
        fontFamily: theme.typography.fontFamily,
        p: isMobile ? 0 : 10,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.colors.green,
          borderRadius: 6,
          p: 4,
          mt: { xs: 6, md: 12 },
        }}
      >
        <Grid container spacing={4}>
          {/* Left Section - Image + Thumbnails */}
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              sx={{
                background: theme.colors.beige,
                width: "100%",
                p: 4,
                borderRadius: 4,
                boxShadow: `3px 12px 0px -3px ${theme.colors.pink};`,
              }}
            >
              <Box
                component="img"
                src={selectedImage}
                sx={{
                  height: isMobile ? "300px" : "450px",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <Swiper
                spaceBetween={10}
                slidesPerView="5"
                direction="horizontal"
                mousewheel={true}
                scrollbar
                modules={[Mousewheel, Scrollbar]}
                loop={true}
                style={{
                  width: "100%",
                  height: "100px",
                  marginTop: "10px",
                }}
              >
                {product.images.edges.map((image, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <Box
                      component="img"
                      src={image.node.url}
                      alt={`thumb-${i}`}
                      onClick={() => handleThumbnailClick(image.node.url)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          image.node.url === selectedImage
                            ? `2px solid ${theme.colors.pink}`
                            : "2px solid transparent",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid>

          {/* Right Section - Details */}
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 8,
            }}
          >
            <Box
              sx={{ color: theme.colors.beige }}
              height={"100%"}
              justifyContent={"space-between"}
              alignItems={"start"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Box>
                <Typography
                  fontSize={isMobile ? "1.7rem" : "2.5rem"}
                  gutterBottom
                  sx={{
                    fontFamily: "Genty",
                    fontWeight: 200,
                    textShadow: `1px 5px 0px ${theme.colors.pink}`,
                  }}
                >
                  {product.title}
                </Typography>
                <Box
                  sx={{
                    fontFamily: theme.fonts.text,
                    fontWeight: 200,
                    textAlign: "justify",
                  }}
                >
                  {parsedParagraphs}
                </Box>
              </Box>

              <Stack mt={isMobile ? 0 : -10}>{parsedAttributes}</Stack>

              <Box>
                <Stack direction="row" gap={3}>
                  {parsedHighlightedAttributes}
                </Stack>

                <Box
                  mt={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                  gap={5}
                >
                  {product.variants.edges[0]?.node.weight !== 0 && (
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: isMobile ? "0.7rem" : "1.4rem",
                        backgroundColor: theme.colors.beige,
                        color: theme.colors.pink,
                        borderRadius: 2,
                        boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                        p: `10px 20px`,
                        fontFamily: theme.fonts.text,
                        fontWeight: 200,
                      }}
                    >
                      weight: {product.variants.edges[0]?.node.weight}
                      {product.variants.edges[0]?.node.weightUnit === "GRAMS"
                        ? "g"
                        : ""}
                    </Typography>
                  )}
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ fontSize: isMobile ? "1.6rem" : "2rem" }}
                  >
                    ₹ {Math.floor(product.variants.edges[0]?.node.price.amount)}
                    /-
                  </Typography>
                </Box>

                <Box
                  mt={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Select
                    value={quantity}
                    onChange={handleQuantityChange}
                    size="small"
                    sx={{
                      fontSize: isMobile ? "0.7rem" : "1.4rem",
                      padding: "5px 20px",
                      backgroundColor: theme.colors.beige,
                      color: theme.colors.pink,
                      borderRadius: 2,
                      width: "100px",
                      boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                      "& .MuiSelect-icon": {
                        color: theme.colors.pink,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    {[...Array(10).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    onClick={handleAddToCart}
                    variant="contained"
                    sx={{
                      padding: "10px 20px",
                      ml: 2,
                      fontFamily: theme.fonts.text,
                      fontWeight: 400,
                      textAlign: "justify",
                      fontSize: isMobile ? "0.7rem" : "1.4rem",
                      backgroundColor: theme.colors.beige,
                      color: theme.colors.pink,
                      boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: theme.colors.pink,
                        color: theme.colors.beige,
                        boxShadow: `0px 4px 0px 0px ${theme.colors.beige}`,
                      },
                    }}
                    endIcon={<FaShoppingCart />}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Section - SVG + Extra */}
      {parsedProductProfile.left.length > 0 &&
        parsedTastingNotes.left.length > 0 && (
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mt={10}
          >
            {/* Product Profile */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
              height="100%"
              display={"flex"}
              justifyContent="start"
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Gliker"
                textTransform="capitalize"
              >
                product profile
              </Typography>

              <Grid
                position="relative"
                display={"flex"}
                justifyContent="start"
                border={`4px solid ${theme.colors.pink}`}
                borderRadius={isMobile ? 4 : 8}
                gap={2}
              >
                <Box
                  component="img"
                  src={pageFold}
                  position="absolute"
                  width={isMobile ? "80px" : "100px"}
                  top={isMobile ? "-24px" : "-30px"}
                  right={isMobile ? "-19px" : "-24px"}
                />

                <Box
                  py={2}
                  borderRadius={isMobile ? "10px 0 0 10px" : "27px 0 0 27px"}
                  height="550px"
                  sx={{
                    maxWidth: "200px",
                    width: "100%",
                    display: "flex",
                    gap: 2,
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    backgroundColor: theme.colors.green,
                  }}
                >
                  {parsedProductProfile.left.map((label, i) => (
                    <Typography
                      key={i}
                      fontSize={
                        isMobile
                          ? ".8rem"
                          : isTablet
                          ? ".8rem"
                          : isSmallDesktop
                          ? "1rem"
                          : "1.2rem"
                      }
                      sx={{
                        width: "100%",
                        m: "0 20px",
                        fontWeight: 500,
                        color: theme.colors.beige,
                        fontFamily: theme.fonts.text,
                      }}
                    >
                      {label}
                    </Typography>
                  ))}
                </Box>

                <Box
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  alignItems="start"
                  py={2}
                  gap={2}
                >
                  {parsedProductProfile.right.map((value, i) => (
                    <Typography
                      key={i}
                      fontSize={
                        isMobile
                          ? ".8rem"
                          : isTablet
                          ? ".8rem"
                          : isSmallDesktop
                          ? "1rem"
                          : "1.2rem"
                      }
                      sx={{
                        fontWeight: 300,
                        color: theme.colors.pink,
                        fontFamily: theme.fonts.text,
                      }}
                    >
                      {value}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Tasting Notes*/}
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
              display={"flex"}
              justifyContent="start"
              alignItems={"center"}
              flexDirection={"column"}
              height="100%"
              mt={isMobile ? 4 : isTablet ? 4 : 0}
            >
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Gliker"
                textTransform="capitalize"
              >
                tasting notes
              </Typography>
              <Box
                borderRadius={isMobile ? 4 : 8}
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
                flexDirection={"column"}
                width="100%"
                height="550px"
                backgroundColor={theme.colors.green}
              >
                <Box
                  width="100%"
                  sx={{
                    scale: isMobile
                      ? "0.8"
                      : isTablet
                      ? "0.8"
                      : isSmallDesktop
                      ? ".9"
                      : "1",
                  }}
                >
                  {parsedTastingNotes.left.map((label, index) => {
                    const value = parsedTastingNotes.right[index];

                    return (
                      <Box
                        key={index}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        marginBottom={1}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "start",
                            fontWeight: "bold",
                            mb: 1,
                            width: "90%",
                            color: theme.colors.beige,
                          }}
                        >
                          {label}
                        </Typography>
                        <Slider
                          defaultValue={value}
                          disabled
                          sx={{
                            width: "90%",
                            borderRadius: 6,

                            "&.Mui-disabled": {
                              color: theme.colors.pink,
                              backgroundColor: theme.colors.beige,

                              "& .MuiSlider-thumb::after": {
                                background: `url(${sliderThumb}) no-repeat center center`,
                                backgroundSize: "cover",
                                width: "55px",
                                height: "55px",
                                position: "absolute",
                                top: "5px",
                                left: "-5px",
                                borderRadius: 0,
                              },

                              "& .MuiSlider-track": {
                                backgroundColor: theme.colors.pink,
                                height: "80%",
                                marginLeft: "3px",
                                borderRadius: 8,
                              },

                              "& .MuiSlider-rail": {
                                display: "none",
                              },
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
    </Box>
  );
};

export default ProductsInternal;
