import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useHydration } from "../hooks/useHydration";
import blogsData from "../data/blogsData.json";
import "./Blogs.scss";

// Import icons
import { FiClock, FiUser, FiCalendar } from "react-icons/fi";

const Blogs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setNavbarTheme } = useNavbarTheme();
  const isHydrated = useHydration();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setNavbarTheme("beige");
    if (isHydrated) {
      setBlogs(blogsData);
    }
  }, [setNavbarTheme, isHydrated]);

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (!isHydrated) {
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
          Loading blogs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.colors.green,
        pt: "8%",
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: theme.fonts.title,
              fontSize: { xs: "2.5rem", md: "5rem" },
              color: theme.colors.beige,
              mb: 2,
              textShadow: `4px 4px 0 ${theme.colors.pink}`,
            }}
          >
            Matcha Stories
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: theme.fonts.text,
              color: theme.colors.beige,
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Discover the world of matcha through our curated stories, recipes,
            and cultural insights
          </Typography>
        </Box>

        {/* Blog Layout - Featured + Scrollable List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
            mb: 10,
          }}
        >
          {/* Featured Article - Left Side */}
          {blogs.length > 0 && (
            <Box sx={{ flex: { xs: "1", lg: "3" } }}>
              <Card
                sx={{
                  height: { xs: "auto", lg: "600px" },
                  border: `4px solid ${theme.colors.beige}`,
                  backgroundColor: theme.colors.beige,
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    border: `4px solid ${theme.colors.pink}`,
                    transform: "translateY(-4px)",
                  },
                }}
                onClick={() => handleBlogClick(blogs[0].id)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={blogs[0].image}
                  alt={blogs[0].title}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
                <CardContent
                  sx={{
                    p: 4,
                    height: "calc(100% - 300px)",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  {/* Category Badge */}
                  <Box mb={2}>
                    <Chip
                      label={blogs[0].category}
                      sx={{
                        backgroundColor: theme.colors.pink,
                        color: theme.colors.beige,
                        fontFamily: theme.fonts.text,
                        fontSize: "0.9rem",
                        height: 32,
                        "& .MuiChip-label": {
                          px: 2,
                        },
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.green,
                      mb: 3,
                      lineHeight: 1.2,
                      fontWeight: "bold",
                    }}
                  >
                    {blogs[0].title}
                  </Typography>

                  {/* Excerpt */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.green,
                      mb: 3,
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {blogs[0].excerpt}
                  </Typography>

                  {/* Meta Information */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mt: "auto",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <FiUser size={16} color={theme.colors.pink} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: theme.fonts.text,
                          color: theme.colors.pink,
                          fontSize: "0.9rem",
                        }}
                      >
                        {blogs[0].author}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <FiCalendar size={16} color={theme.colors.pink} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.pink,
                            fontSize: "0.9rem",
                          }}
                        >
                          {formatDate(blogs[0].date)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <FiClock size={16} color={theme.colors.pink} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.pink,
                            fontSize: "0.9rem",
                          }}
                        >
                          {blogs[0].readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Tags */}
                  <Box mt={3} display="flex" flexWrap="wrap" gap={1}>
                    {blogs[0].tags.slice(0, 4).map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={`#${tag}`}
                        size="medium"
                        sx={{
                          backgroundColor: "transparent",
                          border: `1px solid ${theme.colors.green}`,
                          color: theme.colors.green,
                          fontFamily: theme.fonts.text,
                          fontSize: "0.8rem",
                          height: 28,
                          "&:hover": {
                            backgroundColor: theme.colors.green,
                            color: theme.colors.beige,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Other Articles - Right Side Scrollable */}
          <Box sx={{ flex: { xs: "1", lg: "1" } }}>
            <Box
              sx={{
                height: { xs: "auto", lg: "600px" },
                overflowY: { xs: "visible", lg: "auto" },
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.colors.pink,
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: theme.colors.beige,
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {blogs.slice(1).map((blog, index) => (
                  <Card
                    key={blog.id}
                    sx={{
                      backgroundColor: theme.colors.beige,
                      borderRadius: "15px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        border: `2px solid ${theme.colors.pink}`,
                        transform: "translateY(-4px)",
                        "& img": {
                          transform: "scale(1.05)",
                        },
                      },
                      overflow: "hidden",
                      border: `2px solid transparent`,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      height: { xs: "auto", sm: "160px" },
                    }}
                    onClick={() => handleBlogClick(blog.id)}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "100%", sm: "140px" },
                        height: { xs: "140px", sm: "100%" },
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      image={blog.image}
                      alt={blog.title}
                    />
                    <CardContent
                      sx={{
                        p: 2,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Chip
                          label={blog.category}
                          size="small"
                          sx={{
                            backgroundColor: theme.colors.green,
                            color: theme.colors.beige,
                            fontFamily: theme.fonts.text,
                            fontSize: "0.7rem",
                            height: 24,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: theme.fonts.heading,
                            color: theme.colors.green,
                            mb: 1,
                            lineHeight: 1.3,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.green,
                            opacity: 0.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                          }}
                        >
                          {blog.excerpt}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.pink,
                            fontSize: "0.7rem",
                          }}
                        >
                          {blog.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: theme.fonts.text,
                            color: theme.colors.pink,
                            fontSize: "0.7rem",
                          }}
                        >
                          {blog.readTime}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Call to Action */}
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
              fontSize: "1.1rem",
              py: 1.5,
              px: 4,
              borderRadius: "25px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.colors.beige,
                color: theme.colors.pink,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
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
  );
};

export default Blogs;
