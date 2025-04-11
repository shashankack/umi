import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchShopifyProducts } from "../../utils/shopify";

import {
  Box,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaShoppingCart } from "react-icons/fa";

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
    const paragraphs = doc.querySelectorAll("p");

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

  const parsedTable = useMemo(() => {
    if (!product?.descriptionHtml) return { left: [], right: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(product.descriptionHtml, "text/html");
    const rows = doc.querySelectorAll("table tr");

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
                p: 4,
                borderRadius: 4,
                boxShadow: `3px 12px 0px -3px ${theme.colors.pink};`,
              }}
            >
              <Box
                component="img"
                src={selectedImage}
                sx={{
                  height: isMobile ? "auto" : "450px",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <Stack direction={"row"} spacing={1} mt={2}>
                {product.images.edges.map((image, i) => (
                  <Grid
                    item
                    xs={3}
                    key={i}
                    sx={{
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={image.node.url}
                      alt={`thumb-${i}`}
                      onClick={() => handleThumbnailClick(image.node.url)}
                      sx={{
                        width: "100%",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          image.node.url === selectedImage
                            ? `2px solid ${theme.colors.pink}`
                            : "2px solid transparent",
                      }}
                    />
                  </Grid>
                ))}
              </Stack>
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
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontFamily: theme.fonts.text,
                    fontWeight: 200,
                    textAlign: "justify",
                  }}
                >
                  {parsedParagraphs}
                </Typography>
              </Box>

              <Box mt={4} p={2}>
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
      <Grid container spacing={4} mt={4} height={"100%"}>
        <Grid
          item
          xs={12}
          md={6}
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          border={`3px solid ${theme.colors.pink}`}
          borderRadius={8}
          overflow={"hidden"}
        >
          <Box position="relative">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 350 500"
              preserveAspectRatio="none"
              style={{
                display: "block",
              }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M340.01 14.612V0H246.156H28.662H0V29.786V506.362V522.098V555.256H23.604H318.654L319.216 546.826L320.902 526.594L323.712 514.23L329.332 500.18L337.762 474.328L340.572 451.848L340.01 428.244L336.638 408.012L332.142 393.962L322.588 368.672L318.654 344.506V329.332L319.778 311.348L323.15 297.298L332.704 270.322L338.324 252.338L340.572 235.478V214.122L338.886 200.634L336.638 188.27L332.142 174.782L322.588 148.93L319.778 133.194L318.654 121.392V107.342L319.778 98.912L320.902 89.358L323.15 76.432L327.646 64.63L334.39 46.084L338.324 29.786L340.01 14.612Z"
                fill="#B5D782"
              />
            </svg>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              {parsedTable.left.map((label, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: theme.colors.beige,
                    fontFamily: theme.fonts.text,
                    lineHeight: 1.5,
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
            }}
          >
            {parsedTable.right.map((value, i) => (
              <Typography
                key={i}
                variant="body1"
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
        </Grid>

        {/* Right Column Values */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              backgroundColor: theme.palette.secondary.main,
              p: 2,
              borderRadius: 2,
            }}
          >
            YO
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductsInternal;
