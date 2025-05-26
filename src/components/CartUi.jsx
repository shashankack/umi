import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Button,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useCart } from "../context/CartContext";
import { useNavbarTheme } from "../context/NavbarThemeContext";

const CartUI = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { navbarTheme } = useNavbarTheme();
  const [open, setOpen] = useState(false);
  const {
    lineItems,
    removeItem,
    updateQuantity,
    checkoutUrl,
    loading,
    productImages,
    cartSummary,
  } = useCart();

  const toggleDrawer = () => setOpen(!open);

  if (loading || lineItems.length === 0) return null;

  const summaryStylesLeft = {
    fontFamily: theme.fonts.text,
    fontSize: isMobile ? "3.5vw" : "1vw",
    color: theme.colors.green,
  };

  const summaryStylesRight = {
    fontFamily: theme.fonts.text,
    fontSize: isMobile ? "3.5vw" : "1vw",
    color: theme.colors.pink,
  };

  const iconStyles = {
    fontSize: isMobile ? "4vw" : "2vw",
    color: navbarTheme === "pink" ? theme.colors.beige : theme.colors.pink,
    transition: "all 0.3s ease",
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2000,
          bgcolor:
            navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige,
          borderRadius: "50%",
          boxShadow: `4px 4px 0px 0px ${theme.colors.green}`,
          padding: 1,
          transition: "all 0.3s ease",

          "&:hover": {
            transform: "scale(1.05)",
            boxShadow:
              navbarTheme === "pink"
                ? `4px 4px 0px 0px ${theme.colors.beige}`
                : `4px 4px 0px 0px ${theme.colors.pink}`,
          },
        }}
      >
        <IconButton onClick={toggleDrawer} size="large" disableRipple>
          {open ? (
            <CloseIcon sx={iconStyles} />
          ) : (
            <ShoppingCartIcon sx={iconStyles} />
          )}
        </IconButton>
      </Box>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.colors.beige,
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? 350 : 500,
            p: 2,
            bgcolor: theme.colors.beige,
          }}
        >
          <Typography
            gutterBottom
            fontSize={30}
            display="flex"
            alignItems="center"
            justifyContent="start"
            gap={2}
            fontFamily={theme.fonts.heading}
            fontWeight={600}
            color={theme.colors.pink}
          >
            Your Cart <ShoppingCartIcon />
          </Typography>
          <Divider sx={{ mb: 4, border: `1px solid ${theme.colors.green}` }} />

          <Box maxHeight={500} overflow="auto">
            {lineItems.map((item) => {
              const variant = item.merchandise;
              const productTitle =
                variant?.product?.title || variant?.title || "N/A";
              const productThumbnail = productImages[variant?.id];

              return (
                <>
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        width: 70,
                        height: 70,
                      }}
                    >
                      <Box
                        component="img"
                        src={productThumbnail}
                        alt={productTitle}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Stack
                      flex={1}
                      ml={2}
                      width="100%"
                      direction="column"
                      justifyContent="space"
                      alignItems="start"
                    >
                      <Typography
                        fontSize="1vw"
                        fontFamily={theme.fonts.text}
                        color={theme.colors.green}
                      >
                        {productTitle}
                      </Typography>
                      <Typography
                        fontSize="1.1vw"
                        fontFamily={theme.fonts.text}
                        color={theme.colors.pink}
                      >
                        ₹{item.cost?.subtotalAmount?.amount || "N/A"}/-
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                      <IconButton
                        sx={{ color: theme.colors.green }}
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        size="medium"
                      >
                        <RemoveIcon fontSize="medium" />
                      </IconButton>

                      <Typography
                        sx={{
                          fontFamily: theme.fonts.text,
                          color: theme.colors.green,
                          fontSize: "1.2vw",
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      <IconButton
                        sx={{ color: theme.colors.green }}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        size="medium"
                      >
                        <AddIcon fontSize="medium" />
                      </IconButton>

                      <IconButton
                        sx={{ color: theme.colors.pink }}
                        onClick={() => removeItem(item.id)}
                        size="medium"
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Divider
                    sx={{ mt: 1, border: `1px solid ${theme.colors.pink}` }}
                  />
                </>
              );
            })}
          </Box>

          <Stack
            direction="column"
            spacing={1}
            sx={{
              mb: 3,
              mt: 4,
              textAlign: "left",
              fontFamily: theme.fonts.text,
              fontSize: isMobile ? "3.5vw" : "1vw",
              color: theme.colors.green,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {/* <Typography sx={summaryStylesLeft} width={200}>
                Total Products:
              </Typography>{" "}
              <Typography sx={summaryStylesRight}>
                {cartSummary.totalItems}
              </Typography> */}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={summaryStylesLeft} width={200}>
                Qty:
              </Typography>{" "}
              <Typography sx={summaryStylesRight}>
                {cartSummary.totalQuantity}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={summaryStylesLeft} width={200}>
                Subtotal:
              </Typography>{" "}
              <Typography sx={summaryStylesRight}>
                ₹{cartSummary.subtotal.toFixed(0) + `/-`}
              </Typography>
            </Stack>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            href={checkoutUrl}
            target="_blank"
            sx={{
              mt: 4,
              bgcolor: theme.colors.pink,
              color: theme.colors.beige,
              fontFamily: theme.fonts.text,
              fontSize: "1.2vw",
              "&:hover": {
                bgcolor: theme.colors.green,
                color: theme.colors.beige,
              },
            }}
          >
            Checkout
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CartUI;

/*
 */
