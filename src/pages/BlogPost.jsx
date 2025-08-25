import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  useTheme,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useHydration } from "../hooks/useHydration";
import blogsData from "../data/blogsData.json";
import { FiArrowLeft, FiClock, FiCalendar, FiShare2 } from "react-icons/fi";

const CONTENT_MAX = 1160;

const BlogPost = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const { setNavbarTheme } = useNavbarTheme();
  const isHydrated = useHydration();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedOpen, setCopiedOpen] = useState(false);

  useEffect(() => {
    setNavbarTheme("pink");
  }, [setNavbarTheme]);

  useEffect(() => {
    if (isHydrated && blogId) {
      const foundBlog = blogsData.find((b) => String(b.id) === String(blogId));
      setBlog(foundBlog || null);
      setLoading(false);
    }
  }, [isHydrated, blogId]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleShare = async () => {
    if (!blog) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } finally {
        setCopiedOpen(true);
      }
    }
  };

  const chips = useMemo(
    () => (Array.isArray(blog?.tags) ? blog.tags.slice(0, 12) : []),
    [blog?.tags]
  );

  if (!isHydrated || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: theme.colors.green,
          color: theme.colors.beige,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: theme.fonts.text }}>
          Loading blog…
        </Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: theme.colors.green,
          color: theme.colors.beige,
          display: "grid",
          placeItems: "center",
          p: 4,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontFamily: theme.fonts.heading, mb: 3 }}
          >
            Blog not found
          </Typography>
          <Button
            onClick={() => navigate("/blogs")}
            startIcon={<FiArrowLeft />}
            sx={{
              color: theme.colors.pink,
              border: `1px solid ${theme.colors.pink}`,
              borderRadius: "24px",
              px: 3,
              py: 1,
              "&:hover": {
                bgcolor: theme.colors.pink,
                color: theme.colors.beige,
              },
            }}
          >
            Back to Blogs
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ bgcolor: theme.colors.green }}>
        {/* HERO — full width (use 100%, not 100vw) */}
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "48vh", md: "64vh" },
            backgroundImage: `url(${blog.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.6) 100%)",
            }}
          />

          {/* category chip + title */}
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              zIndex: 2,
            }}
          >
            <Button
              onClick={() => navigate("/blogs")}
              startIcon={<FiArrowLeft />}
              sx={{
                backdropFilter: "blur(4px)",
                bgcolor: "rgba(255,255,255,0.4)",
                color: theme.colors.beige,
                borderRadius: "24px",
                mt: 2,
                px: 2.2,
                py: 0.8,
                fontFamily: theme.fonts.text,
                textTransform: "none",
                "&:hover": {
                  bgcolor: theme.colors.pink,
                  color: theme.colors.beige,
                },
              }}
            >
              Back to Blogs
            </Button>
            <Box sx={{ color: theme.colors.beige, maxWidth: CONTENT_MAX }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: theme.fonts.heading,
                  fontSize: { xs: "2rem", md: "3rem", lg: "3.5rem" },
                  lineHeight: 1.15,
                  textShadow: "0 2px 24px rgba(0,0,0,.4)",
                  pr: { xs: 0, md: 8 },
                  mt: 1,
                }}
              >
                {blog.title}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            width: "100%",
            bgcolor: theme.colors.beige,
            borderTopLeftRadius: { xs: "16px", md: "24px" },
            borderTopRightRadius: { xs: "16px", md: "24px" },
            mt: { xs: -2, md: -4 },
            // If your site has a fixed/sticky footer, keep some padding
            pb: { xs: 12, md: 14 },
          }}
        >
          <Box
            sx={{
              maxWidth: CONTENT_MAX,
              mx: "auto",
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 4, md: 6 },
            }}
          >
            {/* Meta + Share */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                mb: 4,
              }}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box display="flex" alignItems="center" gap={1.25}>
                  <Avatar
                    sx={{
                      bgcolor: theme.colors.pink,
                      color: theme.colors.beige,
                      width: 36,
                      height: 36,
                      fontWeight: 700,
                    }}
                  >
                    {blog.author?.[0] ?? "A"}
                  </Avatar>
                  <Typography
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.green,
                      fontWeight: 600,
                    }}
                  >
                    {blog.author}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <FiCalendar size={18} color={theme.colors.pink} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.pink,
                    }}
                  >
                    {formatDate(blog.date)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <FiClock size={18} color={theme.colors.pink} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.pink,
                    }}
                  >
                    {blog.readTime}
                  </Typography>
                </Box>
              </Box>

              <Button
                onClick={handleShare}
                startIcon={<FiShare2 />}
                sx={{
                  color: theme.colors.pink,
                  border: `1px solid ${theme.colors.pink}`,
                  borderRadius: "24px",
                  px: 2.5,
                  py: 1,
                  fontFamily: theme.fonts.text,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: theme.colors.pink,
                    color: theme.colors.beige,
                  },
                }}
              >
                Share
              </Button>
            </Box>

            {/* Excerpt */}
            {blog.excerpt && (
              <Typography
                variant="h6"
                sx={{
                  fontFamily: theme.fonts.text,
                  color: theme.colors.green,
                  fontSize: "1.25rem",
                  lineHeight: 1.65,
                  mb: 4,
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                {blog.excerpt}
              </Typography>
            )}

            {/* Main Content */}
            {blog.content ? (
              <Typography
                variant="body1"
                sx={{
                  fontFamily: theme.fonts.text,
                  color: theme.colors.green,
                  fontSize: "1.125rem",
                  lineHeight: 1.9,
                  mb: 6,
                  whiteSpace: "pre-line",
                }}
              >
                {blog.content}
              </Typography>
            ) : (
              <Box
                sx={{
                  border: `2px dashed ${theme.colors.pink}`,
                  borderRadius: "16px",
                  p: 4,
                  textAlign: "center",
                  mb: 6,
                  color: theme.colors.pink,
                  fontFamily: theme.fonts.text,
                }}
              >
                📝 Full blog content would appear here… <br />
                This is a demo showing the blog post layout!
              </Box>
            )}

            {/* Tags */}
            {chips.length > 0 && (
              <Box mb={4}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.green,
                    mb: 1.5,
                  }}
                >
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {chips.map((tag, i) => (
                    <Chip
                      key={i}
                      label={`#${tag}`}
                      sx={{
                        bgcolor: theme.colors.green,
                        color: theme.colors.beige,
                        fontFamily: theme.fonts.text,
                        "&:hover": { bgcolor: theme.colors.pink },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* CTA */}
            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: `2px solid ${theme.colors.pink}`,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: theme.fonts.heading,
                  color: theme.colors.green,
                  mb: 2.5,
                }}
              >
                Explore More Stories
              </Typography>
              <Button
                onClick={() => navigate("/blogs")}
                sx={{
                  bgcolor: theme.colors.pink,
                  color: theme.colors.beige,
                  fontFamily: theme.fonts.text,
                  fontSize: "1.05rem",
                  py: 1.3,
                  px: 3.6,
                  borderRadius: "26px",
                  textTransform: "none",
                  transition: "all .25s ease",
                  "&:hover": {
                    bgcolor: theme.colors.green,
                    color: theme.colors.beige,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                View All Blogs
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Share fallback toast */}
        <Snackbar
          open={copiedOpen}
          autoHideDuration={2000}
          onClose={() => setCopiedOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setCopiedOpen(false)}
            severity="success"
            variant="filled"
            sx={{ bgcolor: theme.colors.pink, color: theme.colors.beige }}
          >
            Link copied!
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPost;
