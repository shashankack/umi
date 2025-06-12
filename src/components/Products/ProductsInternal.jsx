import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchShopifyProducts } from "../../utils/shopify";

import { useCart } from "../../context/CartContext";

import sliderThumb from "../../assets/images/vectors/neko/slider_thumb.png";

import {
  Box,
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

const ProductsInternal = () => {
  const theme = useTheme();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { addItem } = useCart();

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    const variantId = product.variants.edges[0]?.node.id;
    if (variantId) {
      addItem(variantId, quantity);
    }
  };

  const parsedTagline = useMemo(() => {
    if (!product?.descriptionHtml) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const taglineElement = doc.querySelector("p.tagline");

    return taglineElement ? (
      <Typography
        variant="h5"
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 700,
          textAlign: "justify",
          fontSize: isMobile ? "3.4vw" : "1.2vw",
        }}
        dangerouslySetInnerHTML={{ __html: taglineElement.innerHTML }}
      />
    ) : null;
  }, [product?.descriptionHtml, theme.fonts.text]);

  const parsedSummary = useMemo(() => {
    if (!product?.descriptionHtml) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const summaryElement = doc.querySelector("p.summary");
    return summaryElement ? (
      <Typography
        variant="h5"
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 800,
          textAlign: isMobile ? "justify" : "start",
          fontSize: isMobile ? "3vw" : "1.2vw",
          mb: 2,
        }}
        dangerouslySetInnerHTML={{ __html: summaryElement.innerHTML }}
      />
    ) : null;
  }, [product?.descriptionHtml, theme.fonts.text]);

  const parsedFullDescription = useMemo(() => {
    if (!product?.descriptionHtml) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const fullDescriptionElement = doc.querySelector("p.full-description");
    return fullDescriptionElement ? (
      <Typography
        variant="body1"
        sx={{
          fontFamily: theme.fonts.text,
          fontWeight: 200,
          textAlign: "justify",
          fontSize: isMobile ? "3.4vw" : "1vw",
          color: theme.colors.beige,
        }}
      >
        {fullDescriptionElement.textContent}
      </Typography>
    ) : null;
  }, [product?.descriptionHtml, theme.fonts.text]);

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
          fontSize: isMobile ? "2.8vw" : "1vw",
          "& strong": {
            fontWeight: 900,
            fontSize: isMobile ? "3vw" : "1.2vw",
          },
          mb: 2,
        }}
        dangerouslySetInnerHTML={{ __html: p.innerHTML }}
      />
    ));
  }, [product?.descriptionHtml, theme.fonts.text, isMobile]);

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
          fontSize: isMobile ? "3.4vw" : "1vw",
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
      <Box key={i}>
        <Typography
          sx={{
            p: isMobile ? "6px 10px" : "10px 30px",
            fontWeight: 200,
            borderRadius: isMobile ? 1 : 3,
            textAlign: "justify",
            color: theme.colors.pink,
            fontFamily: theme.fonts.text,
            backgroundColor: theme.colors.beige,
            fontSize: isMobile ? "3vw" : ".9vw",
            boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
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
        console.log("Incoming product data:", foundProduct);
        setSelectedImage(foundProduct.images.edges[0]?.node.url);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) return <Loading />;

  return (
    <Stack
      bgcolor={theme.colors.green}
      width="100%"
      height="100%"
      pt={isMobile ? 4 : 16}
    >
      {/* Top */}
      <Stack
        width="100%"
        height={isMobile ? "100%" : "60vh"}
        direction="row"
        bgcolor={theme.colors.green}
        borderRadius={6}
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        mt={isMobile ? 8 : 10}
        mb={
          isMobile
            ? parsedProductProfile.left.length > 0
              ? 0
              : 6
            : parsedProductProfile.left.length > 0
            ? 0
            : 10
        }
        px={isMobile ? 4 : 10}
      >
        {/* Image Section */}
        <Stack direction={isMobile ? "column" : "row"} width="100%" gap={5}>
          <Stack
            width={isMobile ? "100%" : "30vw"}
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              p={2}
              boxShadow={
                isMobile ? "none" : `3px 3px 0px 0px ${theme.colors.pink}`
              }
              borderRadius={4}
              bgcolor={theme.colors.beige}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                height={"70%"}
                mb={isMobile ? 2 : 0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  component="img"
                  src={selectedImage}
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
              </Box>
              <Swiper
                slidesPerView="5"
                direction="horizontal"
                mousewheel={true}
                scrollbar
                modules={[Mousewheel, Scrollbar]}
                style={{
                  width: "100%",
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
          </Stack>

          {/* Text Section */}
          <Stack
            width="100%"
            height="100%"
            color={theme.colors.beige}
            alignItems="start"
            justifyContent={!parsedTagline ? "start" : "space-between"}
            gap={
              isMobile
                ? parsedFullDescription
                  ? 0
                  : 2
                : parsedFullDescription
                ? 0
                : 4
            }
          >
            <Typography
              mt={isMobile ? 2 : 0}
              fontSize={isMobile ? "7vw" : "2.6vw"}
              fontFamily={theme.fonts.title}
              fontWeight={500}
              textAlign="start"
              width="100%"
              color={theme.colors.beige}
              sx={{
                textShadow: `1px 5px 0px ${theme.colors.pink}`,
              }}
            >
              {product.title}
            </Typography>

            {parsedTagline && <Box>{parsedTagline}</Box>}

            <Stack
              mt={isMobile ? 2 : 0}
              gap={
                isMobile
                  ? parsedFullDescription
                    ? 0
                    : 2
                  : parsedFullDescription
                  ? 2
                  : 4
              }
              mb={isMobile ? 2 : 0}
              width="100%"
            >
              <Stack direction="row" gap={1}>
                <Typography
                  variant="h1"
                  fontWeight={800}
                  sx={{ fontSize: isMobile ? "7vw" : "1.6vw" }}
                >
                  ₹ {Math.floor(product.variants.edges[0]?.node.price.amount)}
                  /-
                </Typography>
              </Stack>

              <Stack
                width="100%"
                mt={1}
                direction="row"
                alignItems="center"
                justifyContent="start"
                gap={2}
              >
                <Select
                  value={quantity}
                  onChange={handleQuantityChange}
                  size="small"
                  sx={{
                    fontSize: isMobile ? "0.7rem" : ".8vw",
                    backgroundColor: theme.colors.beige,
                    color: theme.colors.pink,
                    borderRadius: 2,
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
                  fullWidth={isMobile}
                  sx={{
                    fontFamily: theme.fonts.text,
                    fontWeight: 400,
                    textAlign: "justify",
                    fontSize: isMobile ? "0.7rem" : "1rem",
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
              </Stack>

              <Stack
                mt={isMobile ? 2 : 0}
                direction="row"
                gap={2}
                width="100%"
                mb={isMobile ? 0 : 4}
              >
                {parsedHighlightedAttributes}
                {product.variants.edges[0]?.node.weight !== 0 && (
                  <Typography
                    variant="h5"
                    sx={{
                      p: isMobile ? "6px 10px" : "10px 30px",
                      fontWeight: 200,
                      borderRadius: isMobile ? 1 : 3,
                      textAlign: "justify",
                      color: theme.colors.pink,
                      fontFamily: theme.fonts.text,
                      backgroundColor: theme.colors.beige,
                      fontSize: isMobile ? "3vw" : ".9vw",
                      boxShadow: `0px 4px 0px 0px ${theme.colors.pink}`,
                    }}
                  >
                    weight: {product.variants.edges[0]?.node.weight}
                    {product.variants.edges[0]?.node.weightUnit === "GRAMS"
                      ? "g"
                      : ""}
                  </Typography>
                )}
              </Stack>
            </Stack>

            <Stack
              fontFamily={theme.fonts.text}
              fontWeight={200}
              textAlign="justify"
            >
              {parsedParagraphs}
              <Stack gap={1}>{parsedAttributes}</Stack>
              <Box>{parsedSummary}</Box>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Bottom */}
      {parsedProductProfile.left.length > 0 &&
        parsedTastingNotes.left.length > 0 && (
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems="center"
            mt={10}
            width="100%"
            height="100%"
            bgcolor={theme.colors.beige}
            overflow="hidden"
            px={isMobile ? 2 : 6}
            py={isMobile ? 4 : 6}
            gap={isMobile ? 4 : 0}
          >
            {/* Product Profile */}
            <Stack alignItems="center" justifyContent="center">
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Gliker"
                textTransform="capitalize"
                fontSize={isMobile ? "5vw" : "2vw"}
              >
                product profile
              </Typography>

              {/* Table Grid */}
              <Box
                width={isMobile ? "100%" : "50vw"}
                height={isMobile ? "auto" : 550}
                position="relative"
                display={"flex"}
                justifyContent="center"
                alignItems="center"
                border={`4px solid ${theme.colors.pink}`}
                borderRadius={isMobile ? 2 : 8}
                fontFamily={theme.fonts.text}
                overflow="hidden"
              >
                {/* Table for Product Profile */}
                <Box
                  sx={{
                    backgroundColor: theme.colors.beige,
                    overflow: "hidden",
                    borderRadius: isMobile
                      ? "4px 0 4px 4px"
                      : "28px 0 28px 28px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      height: "100%",
                      borderSpacing: "0",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      {parsedProductProfile.left.map((label, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              padding: "14px 40px",
                              backgroundColor: theme.colors.green,
                              color: theme.colors.beige,
                              fontWeight: 500,
                              fontSize: isMobile ? "0.8rem" : "1rem",
                              textAlign: "left",
                            }}
                          >
                            {label}
                          </td>
                          <td
                            style={{
                              padding: "14px 10px",
                              backgroundColor: theme.colors.beige,
                              color: theme.colors.pink,
                              fontWeight: 300,
                              fontSize: isMobile ? "0.8rem" : "1rem",
                              textAlign: "left",
                            }}
                          >
                            {parsedProductProfile.right[i]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Stack>

            {/* Tasting Notes*/}
            <Stack alignItems="center" justifyContent="center" width="100%">
              <Typography
                gutterBottom
                color={theme.colors.pink}
                variant="h4"
                fontFamily="Gliker"
                textTransform="capitalize"
                fontSize={isMobile ? "5vw" : "2vw"}
              >
                tasting notes
              </Typography>
              <Box
                borderRadius={isMobile ? 4 : 8}
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
                flexDirection={"column"}
                width={isMobile ? "100%" : "40vw"}
                height={550}
                backgroundColor={theme.colors.green}
              >
                <Box width="100%">
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
                              height: isMobile ? "100%" : "auto",
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
            </Stack>
          </Stack>
        )}

      {/* Full Description  */}
      {parsedFullDescription && (
        <Box
          width="100%"
          bgcolor={theme.colors.green}
          px={isMobile ? 3 : 8}
          py={4}
          mb={4}
        >
          <Typography
            color={theme.colors.beige}
            fontSize={20}
            fontFamily={theme.fonts.text}
            fontWeight={700}
          >
            Full description:
          </Typography>
          {parsedFullDescription}
        </Box>
      )}
    </Stack>
  );
};

export default ProductsInternal;
