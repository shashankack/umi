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
  Container,
  Grid,
} from "@mui/material";
import { useNavbarTheme } from "../context/NavbarThemeContext";
import { useHydration } from "../hooks/useHydration";
import {
  fetchShopifyBlogArticles,
  fetchShopifyBlogPost,
} from "../utils/shopify";
import {
  FiArrowLeft,
  FiClock,
  FiCalendar,
  FiShare2,
  FiList,
  FiX,
} from "react-icons/fi";

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
  const [tocOpen, setTocOpen] = useState(false);
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    setNavbarTheme("pink");
  }, [setNavbarTheme]);

  useEffect(() => {
    if (isHydrated && blogId) {
      const fetchBlogPost = async () => {
        try {
          setLoading(true);
          // First try to fetch all blog articles to find the right blog handle
          const articles = await fetchShopifyBlogArticles();
          const article = articles.find((a) => a.handle === blogId);

          if (article) {
            setBlog(article);
          } else {
            // Fallback: try with default blog handle
            const blogData = await fetchShopifyBlogPost("news", blogId);
            setBlog(blogData);
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          setBlog(null);
        } finally {
          setLoading(false);
        }
      };

      fetchBlogPost();
    }
  }, [isHydrated, blogId]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Extract TOC items dynamically from HTML content
  const extractTocItems = (htmlContent) => {
    if (!htmlContent) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const headings = doc.querySelectorAll("h2[id], h3[id]");

    return Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent.trim(),
      level: parseInt(heading.tagName.charAt(1)), // 2 for h2, 3 for h3
      isSubItem: heading.tagName.toLowerCase() === "h3",
    }));
  };

  // Update TOC items when blog content changes
  useEffect(() => {
    if (blog?.contentHtml) {
      const items = extractTocItems(blog.contentHtml);
      setTocItems(items);
    }
  }, [blog?.contentHtml]);

  const chips = useMemo(
    () => (Array.isArray(blog?.tags) ? blog.tags.slice(0, 12) : []),
    [blog?.tags]
  );

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

  // TOC Navigation Component
  const TocNavigation = ({ items, isMobile = false, onItemClick }) => (
    <Box
      sx={{
        "& a": {
          display: "block",
          color: theme.colors.beige,
          textDecoration: "none",
          py: 1,
          px: 2,
          borderRadius: 2,
          fontSize: isMobile ? "0.9rem" : "0.95rem",
          fontFamily: theme.fonts.text,
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.colors.pink,
            transform: isMobile ? "none" : "translateX(8px)",
          },
          "&.sub-item": {
            ml: 2,
            fontSize: isMobile ? "0.8rem" : "0.85rem",
            fontFamily: theme.fonts.text,
            opacity: 0.9,
            pl: 4, // Extra padding for sub-items
          },
        },
      }}
    >
      {items.map((item) => (
        <a
          key={item.id}
          onClick={() => {
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth" });
            if (onItemClick) onItemClick();
          }}
          className={item.isSubItem ? "sub-item" : ""}
        >
          {item.isSubItem ? `• ${item.title}` : item.title}
        </a>
      ))}
    </Box>
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
      <Box
        sx={{
          bgcolor: theme.colors.green,
          "& html": {
            scrollBehavior: "smooth",
          },
        }}
      >
        {/* HERO — full width (use 100%, not 100vw) */}
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "48vh", md: "64vh" },
            backgroundImage: `url(${blog.image?.url || blog.image})`,
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
            pb: { xs: 12, md: 14 },
          }}
        >
          <Container
            maxWidth={false}
            sx={{ px: { xs: 2, sm: 3, md: 4, lg: 10 } }}
          >
            <Grid container spacing={4} sx={{ pt: { xs: 4, md: 6 } }}>
              {/* Main Content Column */}
              <Grid
                size={{
                  xs: 12,
                  lg: 8,
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
                        {(blog.author?.name || blog.author)?.[0] ?? "A"}
                      </Avatar>
                      <Typography
                        sx={{
                          fontFamily: theme.fonts.text,
                          color: theme.colors.green,
                          fontWeight: 600,
                        }}
                      >
                        {blog.author?.name || blog.author}
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
                        {formatDate(blog.publishedAt || blog.date)}
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
                {blog.contentHtml ? (
                  <Box
                    sx={{
                      fontFamily: theme.fonts.text,
                      color: theme.colors.green,
                      fontSize: "1.125rem",
                      lineHeight: 1.9,
                      mb: 6,
                      "& h1": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        color: theme.colors.green,
                        mt: 4,
                        mb: 3,
                        fontWeight: 700,
                      },
                      "& h2": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.5rem", md: "2rem" },
                        color: theme.colors.pink,
                        mt: 4,
                        mb: 2,
                        fontWeight: 600,
                      },
                      "& h3": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                        color: theme.colors.green,
                        mt: 3,
                        mb: 2,
                        fontWeight: 600,
                      },
                      "& .section-title": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.75rem", md: "2.25rem" },
                        color: theme.colors.pink,
                        mt: 5,
                        mb: 3,
                        fontWeight: 700,
                        borderBottom: `3px solid ${theme.colors.pink}`,
                        paddingBottom: 1,
                      },
                      "& .sub-heading": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.35rem", md: "1.75rem" },
                        color: theme.colors.pink,
                        mt: 4,
                        mb: 2,
                        fontWeight: 600,
                      },
                      "& .step-heading": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                        color: theme.colors.pink,
                        mt: 3,
                        mb: 2,
                        fontWeight: 600,
                        "&::before": {
                          content: '"📝 "',
                          marginRight: 1,
                        },
                      },
                      "& .faq-question": {
                        fontFamily: theme.fonts.heading,
                        fontSize: { xs: "1.15rem", md: "1.4rem" },
                        color: theme.colors.green,
                        mt: 3,
                        mb: 1.5,
                        fontWeight: 600,
                        backgroundColor: `${theme.colors.green}15`,
                        padding: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.colors.pink}`,
                      },
                      "& .faq-answer": {
                        mb: 3,
                        pl: 2,
                        borderLeft: `2px solid ${theme.colors.beige}`,
                        backgroundColor: `${theme.colors.beige}30`,
                        padding: 2,
                        borderRadius: "0 8px 8px 0",
                      },
                      "& .paragraph": {
                        mb: 2.5,
                        lineHeight: 1.8,
                        fontSize: "1.125rem",
                      },
                      "& .facts-list": {
                        backgroundColor: `${theme.colors.green}10`,
                        padding: 3,
                        borderRadius: 3,
                        border: `2px solid ${theme.colors.green}30`,
                        fontSize: "1.1rem",
                        lineHeight: 2,
                      },
                      "& .routine-text": {
                        backgroundColor: `${theme.colors.pink}15`,
                        padding: 2.5,
                        borderRadius: 2,
                        fontWeight: 500,
                      },
                      "& .note": {
                        fontStyle: "italic",
                        color: theme.colors.pink,
                        backgroundColor: `${theme.colors.pink}10`,
                        padding: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                      },
                      "& .image-container": {
                        textAlign: "center",
                        my: 4,
                        width: "100%",
                        "& .content-image": {
                          maxWidth: "100%",
                          width: "100%",
                          height: {
                            xs: "250px",
                            sm: "350px",
                            md: "450px",
                            lg: "500px",
                          },
                          objectFit: "cover",
                          borderRadius: 3,
                          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                          },
                        },
                      },
                      "& .content-image": {
                        maxWidth: "100%",
                        width: "100%",
                        height: {
                          xs: "250px",
                          sm: "350px",
                          md: "450px",
                          lg: "500px",
                        },
                        objectFit: "cover",
                        borderRadius: 3,
                        boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        },
                      },
                      "& img": {
                        maxWidth: "100%",
                        width: "100%",
                        height: { xs: "200px", sm: "300px", md: "400px" },
                        objectFit: "cover",
                        borderRadius: 3,
                        my: 4,
                        display: "block",
                        mx: "auto",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                        },
                      },
                      "& .table-of-contents": {
                        display: "none", // Hide the original TOC table in content
                      },
                      "& ul, & ol": {
                        pl: 3,
                        mb: 3,
                        "& li": {
                          mb: 1.5,
                          lineHeight: 1.7,
                        },
                      },
                      "& .benefits-list, & .tools-list, & .steps-list, & .timing-list, & .storage-list, & .deterioration-list, & .quality-list, & .support-list":
                        {
                          "& li": {
                            position: "relative",
                            paddingLeft: 2,
                            "&::before": {
                              content: '"✓"',
                              position: "absolute",
                              left: 0,
                              color: theme.colors.pink,
                              fontWeight: "bold",
                            },
                          },
                        },
                      "& .product-list": {
                        "& .product-item": {
                          backgroundColor: `${theme.colors.green}10`,
                          padding: 2,
                          borderRadius: 2,
                          mb: 2,
                          border: `1px solid ${theme.colors.green}30`,
                          "& .product-link": {
                            color: theme.colors.pink,
                            fontWeight: 600,
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          },
                        },
                      },
                      "& .cta-section": {
                        backgroundColor: theme.colors.green,
                        color: theme.colors.beige,
                        padding: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        mt: 4,
                        "& .cta-title": {
                          fontFamily: theme.fonts.heading,
                          fontSize: "1.5rem",
                          mb: 3,
                          color: theme.colors.beige,
                        },
                        "& .cta-text": {
                          fontSize: "1.1rem",
                          lineHeight: 1.6,
                          mt: 3,
                        },
                      },
                      "& .section-divider": {
                        border: "none",
                        height: 3,
                        background: `linear-gradient(90deg, ${theme.colors.pink}, ${theme.colors.green})`,
                        my: 5,
                        borderRadius: 2,
                      },
                      "& a": {
                        color: theme.colors.pink,
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                          color: theme.colors.green,
                        },
                      },
                      "& strong": {
                        fontWeight: 600,
                        color: theme.colors.green,
                      },
                      "& em": {
                        fontStyle: "italic",
                        color: theme.colors.pink,
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                  />
                ) : blog.content ? (
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
              </Grid>

              {/* Sticky Table of Contents - Right Column */}
              <Grid
                size={{ xs: 0, lg: 4 }}
                sx={{
                  display: { xs: "none", lg: "block" },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: "100px",
                    height: "fit-content",
                    maxHeight: "calc(100vh - 120px)",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: theme.colors.green,
                      color: theme.colors.beige,
                      borderRadius: 3,
                      p: 3,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: theme.fonts.heading,
                        fontWeight: 700,
                        mb: 2,
                        borderBottom: `2px solid ${theme.colors.pink}`,
                        pb: 1,
                      }}
                    >
                      Table of Contents
                    </Typography>
                    {tocItems.length > 0 ? (
                      <TocNavigation items={tocItems} />
                    ) : (
                      <Typography
                        sx={{
                          color: theme.colors.beige,
                          opacity: 0.7,
                          fontStyle: "italic",
                          fontSize: "0.9rem",
                        }}
                      >
                        No table of contents available
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Mobile Floating TOC Button */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          {/* TOC Toggle Button */}
          <Box
            onClick={() => setTocOpen(!tocOpen)}
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: theme.colors.green,
              color: theme.colors.beige,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: theme.colors.pink,
              },
            }}
          >
            {tocOpen ? <FiX size={24} /> : <FiList size={24} />}
          </Box>

          {/* Expandable TOC Menu */}
          {tocOpen && (
            <Box
              sx={{
                position: "absolute",
                bottom: 70,
                right: 0,
                width: "280px",
                backgroundColor: theme.colors.green,
                color: theme.colors.beige,
                borderRadius: 3,
                p: 3,
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                animation: "slideUp 0.3s ease",
                "@keyframes slideUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: theme.fonts.heading,
                  fontWeight: 700,
                  mb: 2,
                  borderBottom: `2px solid ${theme.colors.pink}`,
                  pb: 1,
                  fontSize: "1.1rem",
                }}
              >
                Table of Contents
              </Typography>
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {tocItems.length > 0 ? (
                  <TocNavigation
                    items={tocItems}
                    isMobile={true}
                    onItemClick={() => setTocOpen(false)}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: theme.colors.beige,
                      opacity: 0.7,
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    No table of contents available
                  </Typography>
                )}
              </Box>
            </Box>
          )}
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
