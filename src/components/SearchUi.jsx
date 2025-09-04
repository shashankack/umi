// src/components/SearchUi.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Close as CloseIcon,
  SearchOutlined,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts } from "../utils/shopify";
import { th } from "framer-motion/client";

export default function SearchUi({ open, onClose }) {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { search } = useLocation();

  // design tokens w/ palette fallback
  const pink = theme.colors?.pink ?? theme.palette.primary.main;
  const green = theme.colors?.green ?? theme.palette.divider;
  const beige = theme.colors?.beige ?? theme.palette.background.paper;
  const white = theme.colors?.white ?? theme.palette.background.default;

  // Seed input from current URL (?q=) when opened
  const initialQ = useMemo(
    () => new URLSearchParams(search).get("q") || "",
    [search]
  );
  const [q, setQ] = useState(initialQ);

  // Inline results state
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const debounceRef = useRef(0);

  // Reset / re-seed when drawer opens or closes
  useEffect(() => {
    if (open) {
      const current =
        new URLSearchParams(window.location.search).get("q") || "";
      setQ(current);
    } else {
      setRows([]);
      setError("");
      setLoading(false);
      window.clearTimeout(debounceRef.current);
    }
  }, [open]);

  // Debounced inline search for list rows
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    const keyword = q.trim();
    if (!open || keyword.length < 2) {
      setRows([]);
      setError(keyword.length ? "Enter at least 2 characters" : "");
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const list = await searchProducts(keyword);
        const arr = Array.isArray(list) ? list.slice(0, 8) : [];
        setRows(arr);
        if (!arr.length) setError("No products found.");
      } catch {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => window.clearTimeout(debounceRef.current);
  }, [q, open]);

  const close = useCallback(() => onClose?.(), [onClose]);

  const goSearch = useCallback(
    (term) => {
      const next = (term ?? q).trim();
      if (!next) return;
      navigate(`/search?q=${encodeURIComponent(next)}`);
      close();
    },
    [q, navigate, close]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    } else if (e.key === "Escape") {
      close();
    }
  };

  const clearInput = () => setQ("");

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={close}
      PaperProps={{
        sx: {
          // surface
          borderRadius: 0,
          bgcolor: beige,
          backdropFilter: "saturate(140%) blur(6px)",
          borderBottom: `1px solid ${alpha(green, 0.6)}`,
          width: "100%",
          maxHeight: smDown ? "85vh" : "70vh",
          boxShadow: "0 10px 30px rgba(0,0,0,.20)",
        },
      }}
      ModalProps={{ keepMounted: true }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 5 },
        }}
      >
        <TextField
          fullWidth
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search products…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 0.25 }}>
                {q ? (
                  <Tooltip title="Clear">
                    <IconButton
                      size="small"
                      onClick={clearInput}
                      aria-label="Clear search"
                      sx={{ color: alpha(pink, 0.9) }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <Tooltip title="Search">
                  <IconButton
                    size="small"
                    onClick={() => goSearch()}
                    aria-label="Submit search"
                    sx={{ color: alpha(pink, 0.9) }}
                  >
                    <SearchOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 48,
              borderRadius: 12,
              background: white,
              transition: "box-shadow .15s ease, border-color .15s ease",
              "& fieldset": {
                borderWidth: 2,
                borderColor: green,
              },
              "&:hover fieldset": {
                borderColor: pink,
              },
              "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${alpha(pink, 0.15)}`,
                "& fieldset": { borderColor: pink },
              },
            },
            "& input::placeholder": { opacity: 0.8 },
          }}
        />

        <Tooltip title="Close">
          <IconButton
            aria-label="Close search"
            onClick={close}
            edge="end"
            sx={{
              ml: 0.5,
              color: pink,
              borderRadius: 10,
              "&:focus-visible": {
                outline: `3px solid ${alpha(pink, 0.4)}`,
                outlineOffset: 2,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Progress bar (brand color) */}
      {loading && (
        <LinearProgress
          sx={{
            "& .MuiLinearProgress-bar": { backgroundColor: pink },
            bgcolor: alpha(green, 0.25),
          }}
        />
      )}

      {/* Inline results */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          pt: 1.5,
          maxHeight: smDown ? "calc(85vh - 110px)" : "calc(70vh - 110px)",
          overflowY: "auto",
        }}
      >
        {!!error && !loading && (
          <Typography
            role="status"
            color="text.secondary"
            sx={{ mb: 1, fontStyle: "italic" }}
          >
            {error}
          </Typography>
        )}

        <List dense disablePadding>
          {rows.map((r, idx) => (
            <ListItemButton
              key={r.id || r.handle || idx}
              onClick={() => goSearch(r.title)}
              sx={{
                borderRadius: 12,
                mb: 0.75,
                px: 1,
                py: 0.75,
                alignItems: "center",
                border: `2px solid ${green}`,
                background: white,
                transition: "transform .12s ease, background-color .12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  backgroundColor: alpha(pink, 0.03),
                },
                "&:focus-visible": {
                  outline: `3px solid ${alpha(pink, 0.35)}`,
                  outlineOffset: 2,
                },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 52 }}>
                {r.image ? (
                  <Avatar
                    src={r.image}
                    alt={r.title}
                    variant="rounded"
                    className="thumb"
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,

                      transition: "transform .12s ease",
                      ".MuiListItemButton-root:hover &": {
                        transform: "scale(1.03)",
                      },
                    }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      bgcolor: alpha(pink, 0.12),
                      color: alpha(pink, 0.9),
                      fontWeight: 700,
                    }}
                  >
                    {r.title?.[0] || "?"}
                  </Avatar>
                )}
              </ListItemAvatar>

              <ListItemText
                primary={r.title}
                secondary={r.handle}
                slotProps={{
                  primary: {
                    variant: "body1",
                    noWrap: true,
                    sx: { fontWeight: 600, color: theme.colors.pink },
                  },
                  secondary: {
                    variant: "caption",
                    noWrap: true,
                    sx: { color: theme.colors.green },
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {rows.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            Press Enter or tap the search icon to view full results.
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
