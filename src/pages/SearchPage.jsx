// src/features/search/SearchPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { searchProducts } from "../utils/shopify";
import slugify from "../utils/slugify";
import { alpha } from "@mui/material/styles";

import { FiArrowUpRight } from "react-icons/fi";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";
const BRAND = import.meta.env.VITE_BRAND_NAME || "Brand";

const SearchPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(24);

  // Build related search terms: full phrase, tokens, simple singular/plural
  const searchTerms = useMemo(() => {
    if (!q) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);

    const set = new Set([q]); // keep the original phrase first
    for (const t of tokens) {
      set.add(t);
      if (t.endsWith("s")) set.add(t.slice(0, -1));
      else set.add(`${t}s`);
    }
    // Cap to a reasonable number to avoid over-fetching
    return Array.from(set).slice(0, 6);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setResults([]);
      setVisible(24);
      if (!q) return;

      try {
        setLoading(true);
        // 1) Exact phrase first for priority
        const [primary, ...others] = await Promise.all(
          searchTerms.map((term) => searchProducts(term))
        );

        // 2) Merge & de-duplicate by handle/id/title; preserve priority
        const seen = new Set();
        const scored = [];

        const pushList = (list, baseScore) => {
          (list || []).forEach((p, i) => {
            const key = (p.handle || p.id || p.title || "").toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);
            scored.push({ ...p, __score: baseScore + i }); // earlier lists & earlier items rank higher
          });
        };

        pushList(primary, 0); // exact phrase wins
        others.forEach((list, idx) => pushList(list, (idx + 1) * 1000)); // then token/variants

        // 3) Sort by score and strip the helper
        const merged = scored
          .sort((a, b) => a.__score - b.__score)
          .map(({ __score, ...rest }) => rest);

        if (!cancelled) setResults(merged);
        if (!cancelled && merged.length === 0) setError("No products found.");
      } catch (e) {
        if (!cancelled) setError("Search failed. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q, searchTerms]);

  const resultCount = useMemo(() => results.length, [results]);
  const canonicalUrl = useMemo(
    () => (q ? `${BASE_URL}/search?q=${encodeURIComponent(q)}` : null),
    [q]
  );

  const visibleResults = useMemo(
    () => results.slice(0, visible),
    [results, visible]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>
          {q ? `Search: ${q}` : "Search"} • {BRAND}
        </title>
        <meta name="robots" content="noindex,follow" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Helmet>

      <Box display="flex" alignItems="baseline" gap={2} mb={2} mt={14}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700 }}
          fontFamily={theme.fonts.text}
          color={theme.colors.beige}
        >
          {q ? `Results for  ${q}` : "Search"}
        </Typography>
      </Box>

      {loading && (
        <LinearProgress
          sx={{
            "& .MuiLinearProgress-bar": { backgroundColor: theme.colors.pink },
            bgcolor: alpha(theme.colors.beige, 0.8),
          }}
        />
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={1}>
        {visibleResults.map((p) => (
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 4,
              lg: 3,
            }}
            key={p.id || p.handle || p.title}
          >
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                borderRadius: 3,
                height: "100%",
                bgcolor: theme.colors.beige,
                borderColor: theme.colors.green,
                transition: "transform .15s ease, box-shadow .15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: theme.colors.pink,
                  boxShadow: `2px 2px 0px ${theme.colors.pink}`,
                },

                "& .arrow-icon": {
                  transition: "transform .3s ease",
                },
                "&:hover .arrow-icon": {
                  transform: "translate(4px, -4px)",
                },
              }}
            >
              <CardActionArea
                component="div"
                role="link"
                tabIndex={0}
                aria-label={`Open ${p.title}`}
                onClick={() => navigate(`/shop/${slugify(p.title)}`)}
                disableRipple
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/shop/${slugify(p.title)}`);
                  }
                }}
                sx={{
                  display: "block",
                  "&:focus-visible": {
                    outlineOffset: "2px",
                    borderRadius: 12,
                  },
                }}
              >
                {/* Media */}
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    borderBottom: `2px solid ${theme.colors.green}`,
                  }}
                >
                  {p.image ? (
                    <Box
                      component="img"
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform .3s ease",
                        ".MuiCard-root:hover &": { transform: "scale(1.05)" },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Typography variant="caption">No image</Typography>
                    </Box>
                  )}

                  {/* Quick add (appears on hover) */}

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: quick add to cart here
                    }}
                    aria-label={`Add ${p.title} to cart`}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: theme.colors.pink,
                      border: `1px solid ${theme.colors.pink}`,
                      borderRadius: 2,
                      opacity: 0,
                      transform: "translateY(-6px)",
                      transition: "opacity .2s ease, transform .2s ease",
                      ".MuiCard-root:hover &": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                      // Touch devices (no hover): keep it visible
                      "@media (hover: none)": {
                        opacity: 1,
                        transform: "none",
                        padding: "6px",
                        backdropFilter: "blur(4px)",
                      },
                      // Keyboard accessibility: show when card is focused
                      ".MuiCardActionArea-root:focus-visible & , .MuiCardActionArea-root:focus-within &":
                        {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                    }}
                  >
                    <ShoppingCartIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content */}
                <CardContent
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 1.25,
                    py: 1.5,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    fontFamily={theme.fonts.text}
                    color={theme.colors.pink}
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {p.title}
                  </Typography>

                  {/* Subtle affordance arrow */}
                  <FiArrowUpRight
                    fontSize={26}
                    color={theme.colors.pink}
                    className="arrow-icon"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load more / end state */}
      {!loading && q && resultCount > visible && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            onClick={() => setVisible((v) => v + 24)}
            sx={{ borderRadius: 2 }}
          >
            Show more
          </Button>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            mt={1}
          >
            Showing {visibleResults.length} of {resultCount}
          </Typography>
        </Box>
      )}

      {!loading && q && resultCount === 0 && !error && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">
            No results. Try a different term.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;
