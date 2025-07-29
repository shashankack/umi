import { useEffect } from 'react';

// Lightweight SEO component without external dependencies
export const SEO = ({ 
  title = "UMI Matcha Club | Premium Japanese Matcha",
  description = "Discover premium Japanese matcha for kinder rituals that fill your cup. 100% organic, single origin matcha from Japan's finest tea gardens.",
  keywords = "matcha, japanese tea, organic matcha, premium matcha, tea ceremony, green tea, wellness, mindfulness",
  image = "/assets/images/about_matcha_banner.png",
  url = window.location.href,
  type = "website"
}) => {
  useEffect(() => {
    const siteTitle = "UMI Matcha Club";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
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
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'UMI Matcha Club');

    // Open Graph tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', siteTitle, true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', url, true);
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Additional SEO
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('googlebot', 'index, follow');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data
    const addStructuredData = (data) => {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    if (type === 'product') {
      addStructuredData({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": "UMI Matcha Club"
        },
        "offers": {
          "@type": "Offer",
          "url": url,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      });
    } else if (type === 'website') {
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "UMI Matcha Club",
        "description": "Premium Japanese matcha for mindful living",
        "url": "https://umimatcha.com",
        "logo": "/assets/images/icons/pink_logo.png",
        "sameAs": [
          "https://www.instagram.com/umimatchaclub",
          "https://pin.it/5YQInpBIg"
        ]
      });
    }
  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};

// Page-specific SEO data
export const SEO_DATA = {
  home: {
    title: "UMI Matcha Club | Premium Japanese Matcha",
    description: "Discover premium Japanese matcha for kinder rituals that fill your cup. 100% organic, single origin matcha from Japan's finest tea gardens.",
    keywords: "matcha, japanese tea, organic matcha, premium matcha, tea ceremony"
  },
  
  shop: {
    title: "Shop Premium Matcha | UMI Matcha Club",
    description: "Browse our collection of premium Japanese matcha products. From ceremonial grade to everyday blends, find your perfect matcha.",
    keywords: "buy matcha, matcha products, japanese matcha, organic tea, premium tea"
  },
  
  about: {
    title: "About Us | UMI Matcha Club",
    description: "Learn about our journey bringing authentic Japanese matcha culture to mindful tea lovers worldwide.",
    keywords: "matcha story, japanese tea culture, organic farming, tea ceremony"
  },
  
  contact: {
    title: "Contact Us | UMI Matcha Club", 
    description: "Get in touch with UMI Matcha Club. We're here to help with your matcha journey.",
    keywords: "contact, customer service, matcha help, tea questions"
  },
  
  faq: {
    title: "FAQ | UMI Matcha Club",
    description: "Find answers to frequently asked questions about matcha, our products, shipping, and more.",
    keywords: "matcha faq, tea questions, shipping info, product help"
  }
};
