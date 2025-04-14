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

const ProductsInternal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 200,
          textAlign: "justify",
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
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 200,
          textAlign: "justify",
          mb: 2,
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

    return Array.from(attributes).map((li, i) => (
      <Box key={i} mb={2} gap={2}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.pink,
            backgroundColor: theme.colors.beige,
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
        setSelectedImage(foundProduct.images.edges[0]?.node.url);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) return <Box p={4}>Loading...</Box>;

  return (
    <Box
      height={
        parsedProductProfile.left.length > 0 ||
        parsedTastingNotes.left.length > 0
          ? "100%"
          : "100vh"
      }
      sx={{
        backgroundColor: theme.colors.beige,
        fontFamily: theme.typography.fontFamily,
        p: { xs: 2, md: 6 },
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
              <Box p={2}>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontFamily: "Genty",
                    fontWeight: 200,
                    textTransform: "lowercase",
                    textShadow: `1px 7px 0px ${theme.colors.pink}`,
                  }}
                >
                  {product.title}
                  {console.log(product.descriptionHtml)}
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

              <Box
                sx={{
                  fontFamily: theme.fonts.text,
                  fontWeight: 200,
                  textAlign: "justify",
                }}
                p={2}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"start"}
              >
                <Typography
                  variant="h4"
                  fontFamily="Genty"
                  fontWeight={200}
                  color={theme.colors.beige}
                >
                  {parsedAttributes}
                </Typography>
              </Box>

              <Box p={2}>
                <Stack direction="row" gap={3}>
                  {parsedHighlightedAttributes}
                </Stack>

                <Box
                  mt={2}
                  display="flex"
                  alignItems="center"
                  justifyContent={"center"}
                  gap={5}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      backgroundColor: theme.colors.beige,
                      color: theme.colors.pink,
                      borderRadius: 2,
                      boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                      px: 3,
                      py: 1,
                    }}
                  >
                    size: {product.variants.edges[0]?.node.weight}
                    {product.variants.edges[0]?.node.weightUnit === "GRAMS"
                      ? "g"
                      : ""}
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {Math.floor(product.variants.edges[0]?.node.price.amount)}
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
                      backgroundColor: theme.colors.beige,
                      color: theme.colors.pink,
                      borderRadius: 2,
                      width: "100px",
                      boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                      "& .MuiSelect-icon": {
                        color: theme.colors.pink,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.colors.pink,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.colors.pink,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.colors.pink,
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
                      ml: 2,
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
      {parsedProductProfile.left.length > 0 ||
        (parsedTastingNotes.left.length > 0 && (
          <Grid container spacing={4}>
            {/* Product Profile */}
            <Grid
              size={{
                xs: 12,
                md: 7,
              }}
              mt={10}
              display={"flex"}
              justifyContent="start"
              alignItems={"center"}
              flexDirection={"column"}
              padding={isMobile ? 0 : 2}
            >
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Genty"
              >
                product profile
              </Typography>

              <Grid
                width={"100%"}
                height={"100%"}
                position="relative"
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
                flexDirection={"row"}
                border={`4px solid ${theme.colors.pink}`}
                borderRadius={8}
                overflow={"hidden"}
              >
                <Box
                  sx={{
                    width: isMobile ? "100%" : "55%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 350 550"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M340.01 14.612V0H246.156H28.662H0V29.786V506.362V522.098V555.256H23.604H318.654L319.216 546.826L320.902 526.594L323.712 514.23L329.332 500.18L337.762 474.328L340.572 451.848L340.01 428.244L336.638 408.012L332.142 393.962L322.588 368.672L318.654 344.506V329.332L319.778 311.348L323.15 297.298L332.704 270.322L338.324 252.338L340.572 235.478V214.122L338.886 200.634L336.638 188.27L332.142 174.782L322.588 148.93L319.778 133.194L318.654 121.392V107.342L319.778 98.912L320.902 89.358L323.15 76.432L327.646 64.63L334.39 46.084L338.324 29.786L340.01 14.612Z"
                      fill="#B5D782"
                    />
                  </svg>
                  <Box
                    position={"absolute"}
                    height={isMobile ? "100%" : "80%"}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-evenly"
                    top="50%"
                    left="10%"
                    sx={{
                      transform: "translateY(-50%)",
                    }}
                  >
                    {parsedProductProfile.left.map((label, i) => (
                      <Typography
                        key={i}
                        variant={isMobile ? "body2" : "h5"}
                        sx={{
                          fontWeight: 500,
                          color: theme.colors.beige,
                          fontFamily: theme.fonts.text,
                        }}
                      >
                        {label}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box
                  position={"relative"}
                  height={"100%"}
                  display={"flex"}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    height={isMobile ? "100%" : "80%"}
                    p={1}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {parsedProductProfile.right.map((value, i) => (
                      <Typography
                        height={isMobile ? "100%" : "80%"}
                        key={i}
                        variant={isMobile ? "body2" : "h5"}
                        sx={{
                          fontWeight: 300,
                          color: theme.colors.pink,
                          fontFamily: theme.fonts.text,
                          lineHeight: 1.5,
                        }}
                      >
                        {value}
                      </Typography>
                    ))}
                  </Box>
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
              justifyContent="center"
              alignItems={"center"}
              flexDirection={"column"}
              mt={10}
            >
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Genty"
              >
                tasting notes
              </Typography>
              <Box
                borderRadius={8}
                sx={{
                  p: 3,
                  width: "100%",
                  backgroundColor: theme.colors.green,
                }}
              >
                {parsedTastingNotes.left.map((label, index) => {
                  const value = parsedTastingNotes.right[index]; // Corresponding value for the left label

                  return (
                    <Box
                      key={index}
                      sx={{ mb: 3 }}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
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
                        {label}{" "}
                        {/* Display the label from parsedTastingNotes.left */}
                      </Typography>
                      <Slider
                        defaultValue={value}
                        disabled
                        sx={{
                          width: "90%",

                          "&.Mui-disabled": {
                            color: theme.colors.pink,
                            backgroundColor: theme.colors.beige,

                            "& .MuiSlider-thumb::after": {
                              background: `url(${sliderThumb}) no-repeat center center`,
                              backgroundSize: "cover",
                              width: "50px",
                              height: "50px",
                              borderRadius: "0",
                            },

                            "& .MuiSlider-track": {
                              backgroundColor: theme.colors.pink,
                              height: "70%",
                              marginLeft: "3px",
                              borderRadius: 2,
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
            </Grid>
          </Grid>
        ))}
    </Box>
  );
};

export default ProductsInternal;
