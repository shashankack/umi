import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";

const CartUI = () => {
  const [open, setOpen] = useState(false);
  const { lineItems, removeItem, updateQuantity, checkoutUrl, loading } =
    useCart();

  const toggleDrawer = () => setOpen(!open);

  if (loading || lineItems.length === 0) return null;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          bgcolor: "#fff",
          borderRadius: "50%",
          boxShadow: 3,
        }}
      >
        <IconButton onClick={toggleDrawer} size="large">
          <ShoppingCartIcon />
        </IconButton>
      </Box>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {lineItems.map((item) => {
            const variant = item.merchandise;
            const productTitle =
              variant?.product?.title || variant?.title || "N/A";
            return (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{productTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.cost?.subtotalAmount?.amount || "N/A"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <IconButton
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography>{item.quantity}</Typography>

                  <IconButton
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => removeItem(item.id)}
                    size="small"
                    sx={{ marginLeft: "auto" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={checkoutUrl}
            target="_blank"
            sx={{ mt: 3 }}
          >
            Checkout
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CartUI;
