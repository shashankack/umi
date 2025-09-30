import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG, getCanonicalUrl, getPageSEO, generateProductSEO, generateBlogSEO } from '../utils/seoConfig';

// Comprehensive SEO component for managing all page metadata
export const SEO = ({ 
  title,
  description,
  keywords,
  image,
  canonical,
  type = "website",
  h1,
  // Product specific
  price,
  availability,
  // Article specific
  publishedTime,
  modifiedTime,
  author,
  // Custom overrides
  robots = "index, follow",
  customMeta = {}
}) => {
  const location = useLocation();
  
  useEffect(() => {
    // Use provided values or fallback to defaults
    const pageTitle = title || SITE_CONFIG.defaultTitle;
    const pageDescription = description || SITE_CONFIG.defaultDescription;
    const pageKeywords = keywords || SITE_CONFIG.defaultKeywords;
    const pageImage = image || SITE_CONFIG.defaultImage;
    const pageCanonical = canonical ? getCanonicalUrl(canonical) : getCanonicalUrl(location.pathname);
    
    // Ensure image has full URL
    const fullImageUrl = pageImage.startsWith('http') ? pageImage : `${SITE_CONFIG.domain}${pageImage}`;

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);
    updateMetaTag('author', author || SITE_CONFIG.author);
    updateMetaTag('robots', robots);
    updateMetaTag('googlebot', robots);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', pageCanonical, true);
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', fullImageUrl, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', SITE_CONFIG.name, true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', SITE_CONFIG.twitterHandle);
    updateMetaTag('twitter:creator', SITE_CONFIG.twitterHandle);
    updateMetaTag('twitter:url', pageCanonical);
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', fullImageUrl);

    // Article specific meta tags
    if (type === 'article') {
      updateMetaTag('article:published_time', publishedTime, true);
      updateMetaTag('article:modified_time', modifiedTime, true);
      updateMetaTag('article:author', author || SITE_CONFIG.author, true);
      updateMetaTag('article:section', 'Matcha & Tea Culture', true);
    }

    // Product specific meta tags
    if (type === 'product') {
      updateMetaTag('product:price:amount', price, true);
      updateMetaTag('product:price:currency', 'INR', true);
      updateMetaTag('product:availability', availability, true);
    }

    // Custom meta tags
    Object.entries(customMeta).forEach(([name, content]) => {
      updateMetaTag(name, content);
    });

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', pageCanonical);

    // Add alternate language links if needed
    let alternateLang = document.querySelector('link[rel="alternate"][hreflang="en-IN"]');
    if (!alternateLang) {
      alternateLang = document.createElement('link');
      alternateLang.setAttribute('rel', 'alternate');
      alternateLang.setAttribute('hreflang', 'en-IN');
      document.head.appendChild(alternateLang);
    }
    alternateLang.setAttribute('href', pageCanonical);

    // Add structured data
    const addStructuredData = (data) => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    // Generate structured data based on type
    if (type === 'product') {
      addStructuredData({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": pageTitle,
        "description": pageDescription,
        "image": fullImageUrl,
        "brand": {
          "@type": "Brand",
          "name": SITE_CONFIG.name
        },
        "offers": {
          "@type": "Offer",
          "url": pageCanonical,
          "priceCurrency": "INR",
          "price": price,
          "availability": availability === 'in_stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": SITE_CONFIG.name
          }
        }
      });
    } else if (type === 'article') {
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": pageTitle,
        "description": pageDescription,
        "image": fullImageUrl,
        "author": {
          "@type": "Person",
          "name": author || SITE_CONFIG.author
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_CONFIG.name,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`
          }
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "mainEntityOfPage": pageCanonical
      });
    } else {
      // Default organization schema
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "description": pageDescription,
        "url": SITE_CONFIG.domain,
        "logo": `${SITE_CONFIG.domain}${SITE_CONFIG.logo}`,
        "sameAs": [
          `https://www.instagram.com/${SITE_CONFIG.instagramHandle}`,
          `https://www.facebook.com/${SITE_CONFIG.facebookPage}`
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": "English"
        }
      });
    }

  }, [title, description, keywords, image, canonical, type, h1, price, availability, publishedTime, modifiedTime, author, robots, customMeta, location.pathname]);

  return null; // This component doesn't render anything
};

// Hook for easier SEO management
export const useSEO = (pathname, product = null, blog = null, customSEO = {}) => {
  if (product) {
    const productSEO = generateProductSEO(product);
    return { ...productSEO, ...customSEO };
  }
  
  if (blog) {
    const blogSEO = generateBlogSEO(blog);
    return { ...blogSEO, ...customSEO };
  }
  
  const pageSEO = getPageSEO(pathname);
  return { ...pageSEO, ...customSEO };
};
