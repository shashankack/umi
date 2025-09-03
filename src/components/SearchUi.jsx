import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Stack,
  CircularProgress,
  Container,
  Dialog,
  LinearProgress,
  Grid,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Close as CloseIcon,
  SearchOutlined,
  ArrowBack,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import {
  searchProducts,
  fetchProductByHandle,
  addToCart as sfAddToCart,
  createCart as sfCreateCart,
} from "../utils/shopify";
import slugify from "../utils/slugify";

async function ensureCartId(getCartId, setCartId) {
  const existing = getCartId?.();
  if (existing) return existing;
  const cart = await sfCreateCart();
  setCartId?.(cart.id);
  return cart.id;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Root = styled("div")(({ theme }) => ({
  fontFamily: theme?.fonts?.text || "inherit",
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    background: theme?.colors?.beige || theme.palette.background.paper,
    paddingRight: 8,
    "& fieldset": {
      borderWidth: 2,
      borderColor: theme?.colors?.green || theme.palette.divider,
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
    fontSize: 18,
  },
}));

const ResultCard = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  overflow: "hidden",
  border: `2px solid ${theme?.colors?.green || theme.palette.divider}`,
  cursor: "pointer",
  width: "100%",
  height: 380,
  display: "flex",
  flexDirection: "column",
  background: theme?.colors?.beige || theme.palette.background.default,
  transition: "transform .12s ease, box-shadow .12s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
  },
}));

const ImageWrap = styled(Box)(({ theme }) => ({
  position: "relative",
  flex: "1 1 auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: theme?.colors?.beige || theme.palette.background.default,
}));

function FullscreenSearch({
  open,
  onClose,
  minChars = 2,
  debounceMs = 250,
  title = "Search",
  getCartId,
  setCartId,
  onAddToCart,
  enableQuickAdd = true,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const canSearch = keyword.trim().length >= minChars;
  const listRef = useRef(null);
  const debouncer = useRef(0);

  useEffect(() => {
    if (!open) {
      setKeyword("");
      setResults([]);
      setError("");
      setLoading(false);
      setActiveIndex(-1);
    }
  }, [open]);

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
        const arr = Array.isArray(list) ? list : [];
        setResults(arr);
        if (arr.length === 0) setError("No products found.");
      } catch (e) {
        setError("Error searching. Please try again.");
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => window.clearTimeout(debouncer.current);
  }, [keyword, canSearch, debounceMs]);

  const close = useCallback(() => onClose?.(), [onClose]);

  const navigateToPdp = useCallback(
    async (product) => {
      try {
        const nameSlug = slugify(product?.title || "");
        if (!nameSlug) return;
        navigate(`/shop/${nameSlug}`);
      } finally {
        close();
      }
    },
    [navigate, close]
  );

  const quickAdd = useCallback(
    async (handle) => {
      if (!enableQuickAdd) return;
      setAdding(handle);
      try {
        const product = await fetchProductByHandle(handle);
        const variant =
          product?.variants?.edges
            ?.map((e) => e.node)
            .find((v) => v.availableForSale) ||
          product?.variants?.edges?.[0]?.node;
        const variantId = variant?.id;
        if (!variantId) throw new Error("No variant available.");
        if (onAddToCart) await onAddToCart(variantId);
        else {
          const cartId = await ensureCartId(getCartId, setCartId);
          await sfAddToCart(cartId, variantId, 1);
        }
      } finally {
        setAdding(null);
      }
    },
    [enableQuickAdd, getCartId, onAddToCart, setCartId]
  );

  const onKeyDown = (e) => {
    if (!open) return;
    if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key))
      e.preventDefault();
    if (e.key === "ArrowDown")
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    else if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
    else if (e.key === "Enter") {
      const item = results[activeIndex];
      if (item) navigateToPdp(item);
    } else if (e.key === "Escape") close();
  };

  return (
    <Root onKeyDown={onKeyDown}>
      <Dialog
        fullScreen
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        PaperProps={{
          sx: { bgcolor: theme?.colors?.beige || "background.paper" },
        }}
      >
        <AppBar elevation={0} color="transparent" position="sticky">
          <Toolbar sx={{ py: 1, gap: 1 }}>
            <IconButton
              edge="start"
              onClick={close}
              aria-label="Close search"
              sx={{ mr: 1, color: theme?.colors?.pink }}
            >
              {isSm ? <ArrowBack /> : <CloseIcon />}
            </IconButton>
            <SearchInput
              placeholder={`Search products${
                minChars > 1 ? ` (min ${minChars} chars)` : ""
              }…`}
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
          {loading && <LinearProgress />}
        </AppBar>

        <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
          {canSearch && (
            <Box>
              <Box
                display="flex"
                alignItems="baseline"
                justifyContent="space-between"
                mb={1}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: theme?.fonts?.heading,
                    color: theme?.colors?.pink,
                  }}
                >
                  {keyword ? `Results for “${keyword}”` : title}
                </Typography>
                {!!results.length && (
                  <Typography variant="body2" color="text.secondary">
                    {results.length} found
                  </Typography>
                )}
              </Box>

              {!!error && !loading && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              <Grid container spacing={2} ref={listRef}>
                {results.map((p, idx) => (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                    }}
                    key={p.handle || p.id}
                  >
                    <ResultCard
                      role="button"
                      aria-label={`View ${p.title}`}
                      onClick={() => navigateToPdp(p)}
                      sx={
                        activeIndex === idx
                          ? { outline: `2px solid ${theme?.colors?.green}` }
                          : undefined
                      }
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <ImageWrap>
                        {p.image ? (
                          <img
                            alt={p.title}
                            src={p.image}
                            style={{
                              width: "80%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                            height="100%"
                          >
                            <Avatar
                              variant="rounded"
                              sx={{ width: 56, height: 56 }}
                            >
                              {p.title?.[0]}
                            </Avatar>
                          </Box>
                        )}
                      </ImageWrap>

                      <Stack
                        p={2}
                        width="100%"
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="body1"
                          noWrap
                          title={p.title}
                          sx={{ fontWeight: 600 }}
                          color={theme.colors.pink}
                          maxWidth="20ch"
                        >
                          {p.title}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          {enableQuickAdd && (
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  quickAdd(p.handle);
                                }}
                                disabled={adding === p.handle}
                                sx={{
                                  color: theme.colors.green,
                                  border: `1px solid ${theme?.colors?.green}`,
                                  borderRadius: 2,
                                  px: 2,
                                  py: 1,
                                }}
                                aria-label={`Quick add ${p.title}`}
                              >
                                {adding === p.handle ? (
                                  <CircularProgress
                                    size={16}
                                    thickness={5}
                                    sx={{ color: theme.colors.green }}
                                  />
                                ) : (
                                  <ShoppingCart fontSize="small" />
                                )}
                              </IconButton>
                            </span>
                          )}
                        </Box>
                      </Stack>
                    </ResultCard>
                  </Grid>
                ))}
              </Grid>

              {!loading && canSearch && results.length === 0 && !error && (
                <Box textAlign="center" py={8}>
                  <Typography variant="body1" color="text.secondary">
                    Try a different term or browse categories.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Dialog>
    </Root>
  );
}

export default FullscreenSearch;
