import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  Chip,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import {
  Close,
  SearchOutlined,
  ShoppingCart,
  Block,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Shopify utils
import {
  searchProducts,
  fetchProductByHandle, // <-- used to get productType when missing
  addToCart as sfAddToCart,
  createCart as sfCreateCart,
} from "../utils/shopify"; // search + fetch by handle  :contentReference[oaicite:4]{index=4}

import slugify from "../utils/slugify"; // build /shop/:productType/:title  :contentReference[oaicite:5]{index=5}

async function ensureCartId(getCartId, setCartId) {
  let id = getCartId?.();
  if (id) return id;
  const cart = await sfCreateCart();
  setCartId?.(cart.id);
  return cart.id;
}

const Root = styled("div")(({ theme }) => ({
  fontFamily: theme?.fonts?.text || "inherit",
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme?.colors?.beige || theme.palette.background.paper,
    color: theme?.colors?.pink || theme.palette.text.primary,
    fontFamily: theme?.fonts?.text,
    "& fieldset": {
      borderColor: theme?.colors?.green || theme.palette.divider,
      borderWidth: 2,
    },
    "&:hover fieldset": {
      borderColor: theme?.colors?.pink || theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme?.colors?.pink || theme.palette.primary.main,
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: theme?.fonts?.text,
  },
}));

/**
 * SearchUI (fixed: navigate by product title path, not variant/handle)
 */
const SearchUI = ({
  open,
  onClose,
  minChars = 2,
  debounceMs = 300,
  title = "Search Products",
  getCartId,
  setCartId,
  onAddToCart,
  enableQuickAdd = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const debouncer = useRef(0);

  const canSearch = keyword.trim().length >= minChars;

  useEffect(() => {
    if (!open) {
      setKeyword("");
      setResults([]);
      setLoading(false);
      setError("");
      setActiveIndex(-1);
      setAdding(null);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    window.clearTimeout(debouncer.current);
    if (!canSearch) {
      setResults([]);
      setError(
        keyword.trim().length ? `Enter at least ${minChars} characters` : ""
      );
      return;
    }
    debouncer.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const list = await searchProducts(keyword.trim());
        setResults(Array.isArray(list) ? list : []);
        if (!list || list.length === 0) setError("No products found.");
      } catch (e) {
        setError("Error searching products. Please try again.");
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => window.clearTimeout(debouncer.current);
  }, [keyword, canSearch, debounceMs]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  /**
   * Build route: /shop/:productTypeSlug/:productTitleSlug
   * If search result lacks productType, fetch by handle to resolve it.
   * Matches your SearchPopup’s routing pattern.  :contentReference[oaicite:6]{index=6}
   */
  const navigateByTitle = useCallback(
    async (product) => {
      try {
        let productType = product?.productType;
        // fetch details if productType missing from search result
        if (!productType && product?.handle) {
          const full = await fetchProductByHandle(product.handle);
          productType = full?.productType || "product";
        }
        const nameSlug = slugify(product?.title || "");
        navigate(`/shop/${nameSlug}`);
      } finally {
        handleClose();
      }
    },
    [navigate, handleClose]
  );

  // Keyboard navigation for list
  const onKeyDown = (e) => {
    if (!open) return;
    if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      scrollIntoView(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
      scrollIntoView(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      const item = results[activeIndex];
      if (item) navigateByTitle(item); // pass the whole product (title-based route)
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  const scrollIntoView = (index) => {
    const node = listRef.current?.querySelector(`[data-index="${index}"]`);
    if (node) node.scrollIntoView({ block: "nearest" });
  };

  // Quick add: first available variant
  const quickAdd = useCallback(
    async (handle) => {
      if (!enableQuickAdd) return;
      setAdding(handle);
      try {
        const product = await fetchProductByHandle(handle);
        const variant =
          product?.variants?.edges
            ?.map((e) => e.node)
            ?.find((v) => v.availableForSale) ||
          product?.variants?.edges?.[0]?.node;
        const variantId = variant?.id;
        if (!variantId) throw new Error("No variant available.");
        if (onAddToCart) {
          await onAddToCart(variantId);
        } else {
          const cartId = await ensureCartId(getCartId, setCartId);
          await sfAddToCart(cartId, variantId, 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAdding(null);
      }
    },
    [enableQuickAdd, getCartId, onAddToCart, setCartId]
  );

  const PriceChip = ({ children }) => (
    <Chip
      size="small"
      label={children}
      sx={{
        borderColor: theme?.colors?.green,
        color: theme?.colors?.pink,
        fontFamily: theme?.fonts?.text,
      }}
      variant="outlined"
    />
  );

  return (
    <Root onKeyDown={onKeyDown}>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: theme?.colors?.white || "background.paper",
            border: `2px solid ${theme?.colors?.green}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: theme?.fonts?.heading,
            color: theme?.colors?.pink,
            pb: 1,
          }}
        >
          {title}
          <IconButton onClick={handleClose} aria-label="Close search">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <SearchField
            variant="outlined"
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={`Type at least ${minChars} characters…`}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => keyword && setKeyword(keyword)}
                    disabled={!canSearch || loading}
                    aria-label="Search"
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {loading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {!!error && !loading && (
            <Typography sx={{ mt: 2 }} color="error">
              {error}
            </Typography>
          )}

          {!loading && results.length > 0 && (
            <List
              dense
              ref={listRef}
              sx={{ mt: 1, maxHeight: isMobile ? 360 : 420, overflowY: "auto" }}
            >
              {results.map((p, idx) => (
                <ListItem
                  key={p.handle || p.id}
                  data-index={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => navigateByTitle(p)} // <-- click uses product title route
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    pr: 8,
                    ...(activeIndex === idx
                      ? {
                          backgroundColor:
                            (theme?.colors?.beige || "#fff") + "99",
                          outline: `2px solid ${theme?.colors?.green}`,
                        }
                      : {
                          "&:hover": {
                            backgroundColor:
                              (theme?.colors?.beige || "#fff") + "66",
                          },
                        }),
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={p.image || undefined}
                      alt={p.title}
                      variant="rounded"
                      sx={{
                        width: 56,
                        height: 56,
                        border: `2px solid ${theme?.colors?.green}`,
                        backgroundColor: theme?.colors?.beige,
                      }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: theme?.fonts?.text,
                          color: theme?.colors?.pink,
                        }}
                      >
                        {p.title}
                      </Typography>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <PriceChip>View details</PriceChip>
                      </Box>
                    }
                  />

                  {enableQuickAdd && (
                    <ListItemSecondaryAction>
                      <Tooltip title="Quick add (first available variant)">
                        <span>
                          <IconButton
                            edge="end"
                            aria-label="Add to cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              quickAdd(p.handle);
                            }}
                            disabled={adding === p.handle}
                            sx={{
                              "&:hover": {
                                backgroundColor: theme?.colors?.pink,
                                color: theme?.colors?.white,
                              },
                              border: `2px solid ${theme?.colors?.green}`,
                            }}
                          >
                            {adding === p.handle ? (
                              <Block fontSize="small" />
                            ) : (
                              <ShoppingCart />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Root>
  );
};

export default SearchUI;
