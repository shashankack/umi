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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  // Debug logging control
  const DEBUG_TOC = true;

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
  const [expandedFaq, setExpandedFaq] = useState(false);

  useEffect(() => {
    setNavbarTheme("pink");
  }, [setNavbarTheme]);

  useEffect(() => {
    if (isHydrated && blogId) {
      const fetchBlogPost = async () => {
        try {
          setLoading(true);
          const articles = await fetchShopifyBlogArticles();
          const article = articles.find((a) => a.handle === blogId);

          if (article) {
            setBlog(article);
          } else {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to generate ID from text (shared between TOC and content rendering)
  const generateIdFromText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "-") // Remove special characters and replace with hyphens
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters except spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Extract TOC items dynamically from HTML content
  const extractTocItems = (htmlContent) => {
    if (!htmlContent) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Strategy 1: Try to extract from existing nav TOC and match with headings
    const tocNav = doc.querySelector("nav[aria-label='Table of Contents']");

    if (DEBUG_TOC) console.log("TOC Nav found:", !!tocNav);

    if (tocNav) {
      const tocItems = [];
      const topLevelItems = Array.from(tocNav.querySelectorAll("ul > li"));

      if (DEBUG_TOC)
        console.log("Top level items found:", topLevelItems.length);

      topLevelItems.forEach((li, index) => {
        // Check if this li is actually a top-level item (not nested)
        const isTopLevel = !li.parentElement.closest("li");

        if (DEBUG_TOC)
          console.log(
            `Item ${index}:`,
            li.textContent.trim(),
            "isTopLevel:",
            isTopLevel
          );

        if (!isTopLevel) return; // Skip nested items in this loop

        // Get the direct text content (exclude nested ul content)
        const textNode = Array.from(li.childNodes).find(
          (node) => node.nodeType === 3
        );
        const directText = textNode ? textNode.textContent.trim() : "";

        if (!directText) return;

        // Try to find matching heading in the document
        const potentialId = generateIdFromText(directText);
        let matchingHeading = doc.getElementById(potentialId);

        // If no exact match, try to find by text content
        if (!matchingHeading) {
          const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
          matchingHeading = Array.from(allHeadings).find(
            (heading) =>
              heading.textContent
                .trim()
                .toLowerCase()
                .includes(directText.toLowerCase()) ||
              directText
                .toLowerCase()
                .includes(heading.textContent.trim().toLowerCase())
          );
        }

        const finalId = matchingHeading?.id || potentialId;

        tocItems.push({
          id: finalId,
          title: directText,
          level: 2,
          isSubItem: false,
        });

        // Handle nested items
        const nestedUl = li.querySelector("ul");
        if (nestedUl) {
          const subItems = nestedUl.querySelectorAll("li");
          subItems.forEach((subLi) => {
            const subText = subLi.textContent.trim();
            if (!subText) return;

            const subId = generateIdFromText(subText);
            let subMatchingHeading = doc.getElementById(subId);

            if (!subMatchingHeading) {
              const allHeadings = doc.querySelectorAll(
                "h1, h2, h3, h4, h5, h6"
              );
              subMatchingHeading = Array.from(allHeadings).find(
                (heading) =>
                  heading.textContent
                    .trim()
                    .toLowerCase()
                    .includes(subText.toLowerCase()) ||
                  subText
                    .toLowerCase()
                    .includes(heading.textContent.trim().toLowerCase())
              );
            }

            const finalSubId = subMatchingHeading?.id || subId;

            tocItems.push({
              id: finalSubId,
              title: subText,
              level: 3,
              isSubItem: true,
            });
          });
        }
      });

      if (DEBUG_TOC) console.log("Final TOC items:", tocItems);

      return tocItems;
    }

    // Fallback: Extract headings directly and ensure they have IDs
    const headingsWithIds = doc.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    );
    if (headingsWithIds.length > 0) {
      return Array.from(headingsWithIds).map((heading) => ({
        id: heading.id,
        title: heading.textContent.trim(),
        level: parseInt(heading.tagName.charAt(1)),
        isSubItem: parseInt(heading.tagName.charAt(1)) > 2,
      }));
    }

    // Extract all headings and generate IDs
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const tocItems = Array.from(allHeadings).map((heading) => {
      const text = heading.textContent.trim();
      const generatedId = generateIdFromText(text);

      // Don't override existing IDs
      const finalId = heading.id || generatedId;

      return {
        id: finalId,
        title: text,
        level: parseInt(heading.tagName.charAt(1)),
        isSubItem: parseInt(heading.tagName.charAt(1)) > 2,
      };
    });

    return tocItems;
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

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  // Custom content renderer that replaces FAQ sections with MUI Accordions
  const renderBlogContent = (htmlContent) => {
    if (!htmlContent) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Ensure all headings have proper IDs that match TOC
    const allHeadings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    allHeadings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent.trim();
        heading.id = generateIdFromText(text);
      }
    });

    const faqSections = doc.querySelectorAll(".faq-section");

    if (faqSections.length === 0) {
      // No FAQ sections, render normally with updated HTML that has proper IDs
      const updatedHtml = doc.documentElement.outerHTML;
      return (
        <Box
          sx={{
            fontFamily: theme.fonts.text,
            color: theme.colors.green,
            fontSize: "1.125rem",
            lineHeight: 1.9,
            mb: 6,
            // Hide Table of Contents from content (we have it in sidebar)
            "& nav[aria-label='Table of Contents']": {
              display: "none",
            },
            // Headings
            "& h2": {
              fontFamily: theme.fonts.heading,
              color: theme.colors.pink,
              marginTop: "2.5rem",
              marginBottom: "1.2rem",
              fontWeight: 700,
            },
            "& h3": {
              fontFamily: theme.fonts.heading,
              color: theme.colors.pink,
              fontWeight: 600,
            },
            "& p": {
              textAlign: "justify",
              marginBottom: "1.25rem",
              paddingLeft: 2,
              fontSize: { xs: "3.6vw", md: "1vw" },
            },
            "& img": {
              maxWidth: "100%",
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "cover",
              borderRadius: 3,
              margin: "2rem 0",
              display: "block",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              },
            },
            "& hr": {
              border: "none",
              height: 2,
              background: theme.colors.pink,
              margin: "3rem 0",
              borderRadius: 2,
            },
            "& a": {
              color: theme.colors.pink,
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: theme.colors.green,
              },
            },
            "& ul": {
              margin: "1.5rem 0",
              paddingLeft: "3rem",
            },
            "& li": {
              marginBottom: "0.7rem",
              lineHeight: 1.7,
            },
            "& .cta-section": {
              bgcolor: theme.colors.green,
              borderRadius: 3,
              padding: 3,
              color: theme.colors.beige,
              "& h2, & h3": {
                fontFamily: theme.fonts.heading,
                marginTop: 0,
                color: theme.colors.beige,
              },
              "& a": {
                color: theme.colors.beige,
              },
              "& ul": {
                margin: "1.5rem 0",
                paddingLeft: "1.5rem",
              },
              "& li": {
                marginBottom: "0.7rem",
                lineHeight: 1.7,
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: updatedHtml }}
        />
      );
    }

    // Process content with FAQ sections using updated HTML
    const parts = [];
    const updatedHtml = doc.body.innerHTML; // Use body innerHTML to avoid html/head tags
    let currentHtml = updatedHtml;

    faqSections.forEach((faqSection, sectionIndex) => {
      const faqHtml = faqSection.outerHTML;
      const beforeFaq = currentHtml.split(faqHtml)[0];
      const afterFaq = currentHtml.split(faqHtml)[1];

      // Add content before FAQ
      if (beforeFaq.trim()) {
        parts.push(
          <Box
            key={`before-faq-${sectionIndex}`}
            sx={{
              fontFamily: theme.fonts.text,
              color: theme.colors.green,
              fontSize: "1.125rem",
              lineHeight: 1.9,
              "& nav[aria-label='Table of Contents']": {
                display: "none",
              },
              "& h2": {
                fontFamily: theme.fonts.heading,
                color: theme.colors.pink,
                marginTop: "2.5rem",
                marginBottom: "1.2rem",
                fontWeight: 700,
                scrollMarginTop: "100px",
              },
              "& h3": {
                fontFamily: theme.fonts.heading,
                color: theme.colors.pink,
                fontWeight: 600,
                scrollMarginTop: "100px",
              },
              "& p": {
                textAlign: "justify",
                marginBottom: "1.25rem",
                paddingLeft: 2,
                fontSize: { xs: "3.6vw", md: "1vw" },
              },
              "& img": {
                maxWidth: "100%",
                width: "100%",
                height: { xs: "200px", sm: "300px", md: "400px" },
                objectFit: "cover",
                borderRadius: 3,
                margin: "2rem 0",
                display: "block",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                },
              },
              "& hr": {
                border: "none",
                height: 2,
                background: theme.colors.pink,
                margin: "3rem 0",
                borderRadius: 2,
              },
              "& a": {
                color: theme.colors.pink,
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  color: theme.colors.green,
                },
              },
              "& ul": {
                margin: "1.5rem 0",
                paddingLeft: "3rem",
              },
              "& li": {
                marginBottom: "0.7rem",
                lineHeight: 1.7,
              },
            }}
            dangerouslySetInnerHTML={{ __html: beforeFaq }}
          />
        );
      }

      // Extract FAQ data
      const titleElement = faqSection.querySelector("h2");
      const title = titleElement
        ? titleElement.textContent.trim()
        : "Frequently Asked Questions";
      const h3Elements = faqSection.querySelectorAll("h3");
      const faqItems = [];

      h3Elements.forEach((h3) => {
        const questionText = h3.textContent.trim().replace(/^Q:\s*/, "");
        let nextElement = h3.nextElementSibling;
        let answer = "";

        while (nextElement && nextElement.tagName !== "H3") {
          if (nextElement.tagName === "P") {
            let answerText = nextElement.innerHTML.trim().replace(/^A:\s*/, "");
            answer += answerText;
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }

        if (questionText && answer) {
          faqItems.push({ question: questionText, answer });
        }
      });

      // Add MUI FAQ Accordion - use ID that matches what TOC expects
      const faqId = faqSection.id || generateIdFromText(title);
      parts.push(
        <Box
          key={`faq-${sectionIndex}`}
          id={faqId}
          sx={{
            my: 4,
            p: { xs: 2, md: 4 },
            backgroundColor: theme.colors.green,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            scrollMarginTop: "100px", // Account for fixed header
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.beige,
              mb: 3,
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {title}
          </Typography>

          {faqItems.map((item, index) => (
            <Accordion
              key={`${sectionIndex}-${index}`}
              expanded={expandedFaq === `panel${sectionIndex}-${index}`}
              onChange={handleFaqChange(`panel${sectionIndex}-${index}`)}
              sx={{
                backgroundColor: theme.colors.beige,
                borderRadius: "12px !important",
                mb: 2,
                border: `2px solid ${theme.colors.pink}`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "0 0 16px 0",
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px rgba(0,0,0,0.15)`,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: theme.colors.pink,
                      fontSize: "1.8rem",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "12px",
                  py: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: `${theme.colors.pink}10`,
                  },
                  "&.Mui-expanded": {
                    minHeight: "64px",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                    "&.Mui-expanded": {
                      margin: "12px 0",
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme.fonts.text,
                    color: theme.colors.pink,
                    fontWeight: 600,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.4,
                    pr: 2,
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  pt: 0,
                  pb: 3,
                  px: 3,
                  borderTop: `1px solid ${theme.colors.pink}20`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: theme.fonts.text,
                    color: theme.colors.green,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.7,
                    textAlign: "justify",
                    "& strong": {
                      color: theme.colors.pink,
                      fontWeight: 600,
                    },
                    "& em": {
                      fontStyle: "italic",
                      color: theme.colors.pink,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      );

      currentHtml = afterFaq;
    });

    // Add remaining content after last FAQ
    if (currentHtml && currentHtml.trim()) {
      parts.push(
        <Box
          key="after-last-faq"
          sx={{
            fontFamily: theme.fonts.text,
            color: theme.colors.green,
            fontSize: "1.125rem",
            lineHeight: 1.9,
            "& nav[aria-label='Table of Contents']": {
              display: "none",
            },
            "& h2": {
              fontFamily: theme.fonts.heading,
              color: theme.colors.pink,
              marginTop: "2.5rem",
              marginBottom: "1.2rem",
              fontWeight: 700,
              scrollMarginTop: "100px",
            },
            "& h3": {
              fontFamily: theme.fonts.heading,
              color: theme.colors.pink,
              fontWeight: 600,
              scrollMarginTop: "100px",
            },
            "& p": {
              textAlign: "justify",
              marginBottom: "1.25rem",
              paddingLeft: 2,
              fontSize: { xs: "3.6vw", md: "1vw" },
            },
            "& img": {
              maxWidth: "100%",
              width: "100%",
              height: { xs: "200px", sm: "300px", md: "400px" },
              objectFit: "cover",
              borderRadius: 3,
              margin: "2rem 0",
              display: "block",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              },
            },
            "& hr": {
              border: "none",
              height: 2,
              background: theme.colors.pink,
              margin: "3rem 0",
              borderRadius: 2,
            },
            "& a": {
              color: theme.colors.pink,
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                color: theme.colors.green,
              },
            },
            "& ul": {
              margin: "1.5rem 0",
              paddingLeft: "3rem",
            },
            "& li": {
              marginBottom: "0.7rem",
              lineHeight: 1.7,
            },
          }}
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      );
    }

    return <>{parts}</>;
  };

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
            if (DEBUG_TOC) console.log(`Attempting to scroll to: ${item.id}`);
            const element = document.getElementById(item.id);
            if (DEBUG_TOC) console.log(`Found element:`, element);

            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else {
              // Fallback: try after a short delay to allow React rendering
              setTimeout(() => {
                const delayedElement = document.getElementById(item.id);
                if (DEBUG_TOC)
                  console.log(`Delayed search found element:`, delayedElement);
                if (delayedElement) {
                  delayedElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 100);
            }

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

                    {/* Date */}
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
                    {/* Time */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <FiClock size={18} color={theme.colors.pink} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: theme.fonts.text,
                          color: theme.colors.pink,
                        }}
                      >
                        {(() => {
                          const date = new Date(blog.publishedAt || blog.date);
                          return date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          });
                        })()}
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

                {/* Main Content */}
                {blog.contentHtml ? (
                  renderBlogContent(blog.contentHtml)
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
