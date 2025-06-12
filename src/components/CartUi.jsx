import { useState, useEffect, useRef } from "react";
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
  GlobalStyles,
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
  const [snackOpen, setSnackOpen] = useState(false);

  const {
    lineItems,
    removeItem,
    updateQuantity,
    checkoutUrl,
    loading,
    productImages,
    cartSummary,
  } = useCart();

  const cartIconRef = useRef(null);
  const hasHydrated = useRef(false);
  const prevQuantityRef = useRef(cartSummary.totalQuantity ?? 0);

  const toggleDrawer = () => setOpen(!open);

  useEffect(() => {
    if (snackOpen) {
      const timeout = setTimeout(() => setSnackOpen(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [snackOpen]);

  useEffect(() => {
    const currentQty = cartSummary.totalQuantity ?? 0;

    if (!hasHydrated.current) {
      prevQuantityRef.current = currentQty;
      hasHydrated.current = true;
      return;
    }

    if (currentQty > prevQuantityRef.current) {
      setSnackOpen(true);
    }

    prevQuantityRef.current = currentQty;
  }, [cartSummary.totalQuantity]);

  if (loading || lineItems.length === 0) return null;

  const textStyle = {
    fontFamily: theme.fonts.text,
    fontSize: isMobile ? "4.4vw" : "1.05vw",
    fontWeight: 500,
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes thoughtBubbleGrow": {
            "0%": {
              opacity: 0,
              transform: "scaleX(0)",
            },
            "10%": {
              opacity: 1,
              transform: "scaleX(1)",
            },
            "85%": {
              opacity: 1,
              transform: "scaleX(1)",
            },
            "100%": {
              opacity: 0,
              transform: "scaleX(0)",
            },
          },
        }}
      />

      <Box
        ref={cartIconRef}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 4000,
          bgcolor:
            navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige,
          borderRadius: "50%",
          boxShadow: `2px 2px 0 ${theme.colors.green}`,
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.1)",
            transition: "transform 0.3s",
          },
        }}
      >
        <IconButton onClick={toggleDrawer} size="large" disableRipple>
          {open ? (
            <CloseIcon
              sx={{
                color:
                  navbarTheme === "pink"
                    ? theme.colors.beige
                    : theme.colors.pink,
                fontSize: isMobile ? "6vw" : "2vw",
              }}
            />
          ) : (
            <ShoppingCartIcon
              sx={{
                color:
                  navbarTheme === "pink"
                    ? theme.colors.beige
                    : theme.colors.pink,
                fontSize: isMobile ? "6vw" : "2vw",
              }}
            />
          )}
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.colors.beige,
            width: isMobile ? "100%" : 460,
            px: 3,
            py: 4,
            boxShadow: `-8px 0 18px rgba(0, 0, 0, 0.1)`,
          },
        }}
      >
        <Typography
          variant="h4"
          fontFamily={theme.fonts.heading}
          fontWeight={700}
          color={theme.colors.pink}
          sx={{ mb: 3 }}
        >
          Your Cart
        </Typography>

        <Divider
          sx={{
            border: 1,
            borderRadius: 2,
            borderColor: theme.colors.green,
            mb: 3,
          }}
        />

        <Box sx={{ maxHeight: 380, overflowY: "auto" }}>
          {lineItems.map((item) => {
            const variant = item.merchandise;
            const title = variant?.product?.title || "Item";
            const image = productImages[variant?.id];

            return (
              <Stack key={item.id} direction="row" spacing={2} mb={3}>
                <Box
                  component="img"
                  src={image}
                  alt={title}
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
                <Box flex={1}>
                  <Typography
                    sx={{
                      fontFamily: theme.fonts.text,
                      fontSize: isMobile ? "3.8vw" : "0.95vw", // smaller than original
                      fontWeight: 600,
                      color: theme.colors.green,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: theme.fonts.text,
                      fontSize: isMobile ? "3.5vw" : "0.85vw",
                      fontWeight: 400,
                      color: theme.colors.green,
                      mt: 0.2,
                    }}
                  >
                    {variant?.title}
                  </Typography>

                  <Typography
                    sx={{ ...textStyle, color: theme.colors.pink, mt: 0.5 }}
                  >
                    ₹{item.cost?.subtotalAmount?.amount || "N/A"}/-
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      sx={{ color: theme.colors.green }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      fontFamily={theme.fonts.text}
                      color={theme.colors.green}
                      fontWeight={600}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      sx={{ color: theme.colors.green }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Remove item"
                      onClick={() => removeItem(item.id)}
                      sx={{ color: theme.colors.pink }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Stack>
            );
          })}
        </Box>

        <Divider
          sx={{
            border: 1,
            borderRadius: 2,
            borderColor: theme.colors.pink,
            mb: 1,
          }}
        />

        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={textStyle} color={theme.colors.green}>
              Qty
            </Typography>
            <Typography sx={textStyle} color={theme.colors.pink}>
              {cartSummary.totalQuantity}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={textStyle} color={theme.colors.green}>
              Subtotal
            </Typography>
            <Typography sx={textStyle} color={theme.colors.pink}>
              ₹{cartSummary.subtotal.toFixed(0)}/-
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          href={checkoutUrl}
          target="_blank"
          fullWidth
          sx={{
            mt: 4,
            py: 1,
            borderRadius: 2,
            bgcolor: theme.colors.pink,
            color: theme.colors.beige,
            fontFamily: theme.fonts.text,
            fontWeight: 600,
            fontSize: isMobile ? "4vw" : "1rem",
            "&:hover": {
              bgcolor: theme.colors.green,
              color: theme.colors.beige,
            },
          }}
        >
          Proceed to Checkout
        </Button>
      </Drawer>
      {snackOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 44,
            zIndex: 3999,
            transformOrigin: "right center",
            animation: "thoughtBubbleGrow 2s ease-in-out forwards",
          }}
        >
          <Box
            sx={{
              position: "relative",
              px: 2.5,
              py: 1.5,
              backgroundColor:
                navbarTheme === "pink" ? theme.colors.pink : theme.colors.beige,
              color: theme.colors.beige,
              fontFamily: theme.fonts.text,
              fontWeight: 500,
              fontSize: isMobile ? "3.8vw" : "0.95rem",
              borderRadius: "18px",
              boxShadow: `0 6px 18px rgba(0, 0, 0, 0.15)`,
              whiteSpace: "nowrap",
              "&::after": {
                content: '""',
                position: "absolute",
                right: 16,
                top: "100%",
                width: 12,
                height: 12,
                backgroundColor:
                  navbarTheme === "pink"
                    ? theme.colors.pink
                    : theme.colors.beige,
                borderRadius: "50%",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                right: 8,
                top: "100%",
                width: 8,
                height: 8,
                backgroundColor: theme.colors.pink,
                borderRadius: "50%",
              },
            }}
          >
            Item added to cart!
          </Box>
        </Box>
      )}
    </>
  );
};

export default CartUI;
