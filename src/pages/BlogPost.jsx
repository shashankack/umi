import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useTheme,
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useHydration } from "../hooks/useHydration";
import blogsData from "../data/blogsData.json";
import "./Blogs.scss";

// Import icons
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiCalendar,
  FiShare2,
} from "react-icons/fi";

const BlogPost = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const { setNavbarTheme } = useNavbarTheme();
  const isHydrated = useHydration();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNavbarTheme("pink");
    if (isHydrated && blogId) {
      const foundBlog = blogsData.find((b) => b.id === blogId);
      setBlog(foundBlog);
      setLoading(false);
    }
  }, [setNavbarTheme, isHydrated, blogId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (!isHydrated || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.colors.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: theme.colors.beige }}>
          Loading blog...
        </Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.colors.green,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.beige,
            mb: 3,
          }}
        >
          Blog not found
        </Typography>
        <Button
          onClick={() => navigate("/blogs")}
          startIcon={<FiArrowLeft />}
          sx={{
            color: theme.colors.pink,
            fontFamily: theme.fonts.text,
            "&:hover": {
              backgroundColor: theme.colors.pink,
              color: theme.colors.beige,
            },
          }}
        >
          Back to Blogs
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.colors.green,
        pt: 14,
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        {/* Back Button */}
        <Box mb={4}>
          <Button
            onClick={() => navigate("/blogs")}
            startIcon={<FiArrowLeft />}
            sx={{
              color: theme.colors.beige,
              fontFamily: theme.fonts.text,
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: theme.colors.pink,
                color: theme.colors.beige,
              },
              borderRadius: "20px",
              px: 3,
              py: 1,
            }}
          >
            Back to Blogs
          </Button>
        </Box>

        {/* Blog Content */}
        <Box
          sx={{
            backgroundColor: theme.colors.beige,
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.1)",
          }}
        >
          {/* Hero Image */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "250px", md: "400px" },
              backgroundImage: `url(${blog.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,
              }}
            >
              <Chip
                label={blog.category}
                sx={{
                  backgroundColor: theme.colors.pink,
                  color: theme.colors.beige,
                  fontFamily: theme.fonts.text,
                  fontSize: "1rem",
                  height: 36,
                  "& .MuiChip-label": {
                    px: 3,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Box p={{ xs: 3, md: 6 }}>
            {/* Title */}
            <Typography
              variant="h2"
              sx={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.green,
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {blog.title}
            </Typography>

            {/* Meta Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                mb: 4,
                gap: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    sx={{
                      backgroundColor: theme.colors.pink,
                      color: theme.colors.beige,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {blog.author.charAt(0)}
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
                  <FiCalendar size={16} color={theme.colors.pink} />
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
                  <FiClock size={16} color={theme.colors.pink} />
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
                  borderRadius: "20px",
                  fontFamily: theme.fonts.text,
                  "&:hover": {
                    backgroundColor: theme.colors.pink,
                    color: theme.colors.beige,
                  },
                }}
              >
                Share
              </Button>
            </Box>

            {/* Excerpt */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: theme.fonts.text,
                color: theme.colors.green,
                fontSize: "1.3rem",
                lineHeight: 1.6,
                mb: 4,
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              {blog.excerpt}
            </Typography>

            {/* Main Content */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: theme.fonts.text,
                color: theme.colors.green,
                fontSize: "1.1rem",
                lineHeight: 1.8,
                mb: 6,
              }}
            >
              {blog.content}
            </Typography>

            {/* Content placeholder - In a real app, you'd have the full blog content */}
            <Box
              sx={{
                border: `2px dashed ${theme.colors.pink}`,
                borderRadius: "16px",
                p: 4,
                textAlign: "center",
                mb: 6,
              }}
            >
              <Typography
                sx={{
                  fontFamily: theme.fonts.text,
                  color: theme.colors.pink,
                  fontSize: "1.1rem",
                }}
              >
                📝 Full blog content would appear here...
                <br />
                <br />
                This is just a demo showing the blog post layout!
              </Typography>
            </Box>

            {/* Tags */}
            <Box mb={4}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: theme.fonts.heading,
                  color: theme.colors.green,
                  mb: 2,
                }}
              >
                Tags
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {blog.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    sx={{
                      backgroundColor: theme.colors.green,
                      color: theme.colors.beige,
                      fontFamily: theme.fonts.text,
                      "&:hover": {
                        backgroundColor: theme.colors.pink,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Navigation to other blogs */}
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
                  mb: 3,
                }}
              >
                Explore More Stories
              </Typography>
              <Button
                onClick={() => navigate("/blogs")}
                sx={{
                  backgroundColor: theme.colors.pink,
                  color: theme.colors.beige,
                  fontFamily: theme.fonts.text,
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 4,
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: theme.colors.green,
                    color: theme.colors.beige,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                View All Blogs
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPost;
