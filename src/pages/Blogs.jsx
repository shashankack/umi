import React, { useEffect, useMemo, useState } from "react";
import {
  useTheme,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  useMediaQuery,
  Skeleton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useHydration } from "../hooks/useHydration";
import blogsData from "../data/blogsData.json";
import { FiClock, FiUser, FiCalendar } from "react-icons/fi";
import Footer from "../components/Footer";

const Blogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { setNavbarTheme } = useNavbarTheme();
  const isHydrated = useHydration();

  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setNavbarTheme("beige");
    if (isHydrated) setBlogs(blogsData);
  }, [setNavbarTheme, isHydrated]);

  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? blogs
        : blogs.filter((b) => b.category === activeCategory),
    [blogs, activeCategory]
  );

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!isHydrated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.colors.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack spacing={3} width="min(100%, 1100px)">
          <Skeleton
            variant="text"
            height={64}
            sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
          />
          <Skeleton
            variant="rounded"
            height={300}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
                key={i}
              >
                <Skeleton
                  variant="rounded"
                  height={160}
                  sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    );
  }

  const featured = !isMobile ? filtered[0] : null;
  const list = !isMobile ? filtered.slice(1) : filtered;

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.colors.green,
          pt: { xs: "16%", md: "8%" },
          pb: 10,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: theme.fonts.title,
                fontSize: { xs: "8vw", md: "4.4vw" },
                color: theme.colors.beige,
                mt: { xs: "15%", md: "3%" },
                mb: 1,
                textShadow: `4px 4px 0 ${theme.colors.pink}`,
                lineHeight: 1,
              }}
            >
              Matcha Stories
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "3.4vw", md: "1.6vw" },
                fontFamily: theme.fonts.text,
                color: theme.colors.beige,
                maxWidth: 820,
                mx: "auto",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Discover the world of matcha through curated stories, recipes, and
              cultural insights.
            </Typography>
          </Box>

          {/* Category filter */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              mb: 4,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                background: theme.colors.pink,
                borderRadius: 8,
              },
            }}
          >
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    borderRadius: 999,
                    px: 1.5,
                    height: 36,
                    fontFamily: theme.fonts.text,
                    color: active ? theme.colors.pink : theme.colors.beige,
                    backgroundColor: active
                      ? theme.colors.beige
                      : "transparent",
                    border: `2px solid ${theme.colors.beige}`,
                    "&:hover": {
                      backgroundColor: active
                        ? theme.colors.beige
                        : "rgba(255,255,255,0.12)",
                    },
                    transition: "all .2s ease",
                  }}
                />
              );
            })}
          </Box>

          {/* Layout: Featured + list */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 4,
            }}
          >
            {/* Featured */}
            {!isMobile && featured && (
              <Box sx={{ flex: { xs: 1, lg: 3 }, minWidth: 0 }}>
                <Card
                  onClick={() => handleBlogClick(featured.id)}
                  sx={{
                    position: "relative",
                    height: 700,
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: `4px solid ${theme.colors.beige}`,
                    cursor: "pointer",
                    transform: "translateZ(0)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: theme.colors.pink,
                    },
                    transition: "all .25s ease",
                    backgroundColor: theme.colors.beige,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={featured.image}
                    alt={featured.title}
                    loading="lazy"
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      filter: "saturate(0.95)",
                      transform: "scale(1)",
                      transition: "transform .4s ease",
                      ".MuiCard-root:hover &": { transform: "scale(1.04)" },
                    }}
                  />
                  {/* Overlay gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 85%)",
                    }}
                  />
                  {/* Category chip */}
                  <Chip
                    label={featured.category}
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      backgroundColor: theme.colors.pink,
                      color: theme.colors.beige,
                      fontFamily: theme.fonts.text,
                      fontSize: "0.9rem",
                      height: 32,
                      borderRadius: 2,
                      boxShadow: `0 3px 0 ${theme.colors.green}`,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                  {/* Content overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: { xs: 2.5, md: 4 },
                      color: theme.colors.beige,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.beige,
                        fontSize: { xs: "1.6rem", md: "2.2rem" },
                        lineHeight: 1.15,
                        mb: 1.5,
                        textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                      }}
                    >
                      {featured.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: theme.fonts.text,
                        color: theme.colors.beige,
                        opacity: 0.95,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    >
                      {featured.excerpt}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <FiUser size={16} color={theme.colors.beige} />
                          <Typography sx={{ fontFamily: theme.fonts.text }}>
                            {featured.author}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <FiCalendar size={16} color={theme.colors.beige} />
                          <Typography sx={{ fontFamily: theme.fonts.text }}>
                            {formatDate(featured.date)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <FiClock size={16} color={theme.colors.beige} />
                        <Typography sx={{ fontFamily: theme.fonts.text }}>
                          {featured.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Box>
            )}

            {/* List */}
            <Box sx={{ flex: { xs: 1, lg: 2 } }}>
              <Box
                px={2}
                sx={{
                  height: { xs: "auto", lg: 700 },
                  overflowY: { xs: "visible", lg: "auto" },
                  pr: { lg: 1 },
                  "&::-webkit-scrollbar": { width: 8 },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 10,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.colors.pink,
                    borderRadius: 10,
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: theme.colors.beige,
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {list.map((blog) => (
                    <Card
                      key={blog.id}
                      onClick={() => handleBlogClick(blog.id)}
                      sx={{
                        backgroundColor: theme.colors.beige,
                        borderRadius: 3,
                        border: `2px solid transparent`,
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        height: { xs: "auto", sm: 170 },
                        transition:
                          "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                          borderColor: theme.colors.pink,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        loading="lazy"
                        image={blog.image}
                        alt={blog.title}
                        sx={{
                          width: { xs: "100%", sm: 180 },
                          height: { xs: 160, sm: "100%" },
                          objectFit: "cover",
                          transition: "transform .35s ease",
                          ".MuiCard-root:hover &": { transform: "scale(1.03)" },
                        }}
                      />
                      <CardContent
                        sx={{
                          p: 2,
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Chip
                            label={blog.category}
                            size="small"
                            sx={{
                              backgroundColor: theme.colors.green,
                              color: theme.colors.beige,
                              fontFamily: theme.fonts.text,
                              height: 24,
                              borderRadius: 1,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: theme.fonts.text,
                              color: theme.colors.pink,
                            }}
                          >
                            {formatDate(blog.date)} • {blog.readTime}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: theme.fonts.heading,
                            color: theme.colors.green,
                            lineHeight: 1.25,
                            fontWeight: 800,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {blog.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.green,
                            opacity: 0.85,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flexGrow: 1,
                          }}
                        >
                          {blog.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: theme.fonts.text,
                              color: theme.colors.pink,
                            }}
                          >
                            {blog.author}
                          </Typography>
                          <Button
                            size="small"
                            sx={{
                              textTransform: "none",
                              fontFamily: theme.fonts.text,
                              backgroundColor: theme.colors.pink,
                              color: theme.colors.beige,
                              px: 1.5,
                              py: 0.6,
                              borderRadius: 999,
                              boxShadow: `0 3px 0 ${theme.colors.green}`,
                              "&:hover": {
                                backgroundColor: theme.colors.beige,
                                color: theme.colors.pink,
                              },
                            }}
                          >
                            Read story
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* CTA */}
          <Box textAlign="center" mt={8}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.beige,
                mb: 2,
              }}
            >
              Want to share your matcha story?
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.colors.pink,
                color: theme.colors.beige,
                fontFamily: theme.fonts.text,
                fontSize: "1.05rem",
                py: 1.4,
                px: 4,
                borderRadius: "999px",
                textTransform: "none",
                boxShadow: `0 4px 0 ${theme.colors.beige}`,
                "&:hover": {
                  backgroundColor: theme.colors.beige,
                  color: theme.colors.pink,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s ease",
              }}
              onClick={() => {
                navigate("/contact");
                window.scrollTo(0, 0);
              }}
            >
              Get in Touch
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Blogs;
