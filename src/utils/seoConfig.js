// SEO Configuration and Metadata Management System

export const SITE_CONFIG = {
  name: "Umi Matcha",
  domain: "https://www.umimatchashop.com",
  defaultTitle: "Umi Matcha - Best Organic Matcha from Japan in India",
  defaultDescription: "Experience premium organic matcha from Japan. Ceremonial grade green tea powder for wellness, focus, and mindful living. Shop authentic Japanese matcha online in India.",
  defaultKeywords: "organic matcha, japanese matcha, matcha powder, green tea, ceremonial matcha, matcha tea, wellness tea, japanese tea ceremony",
  author: "Umi Matcha",
  twitterHandle: "@umimatchaclub",
  facebookPage: "umimatchaclub",
  instagramHandle: "umimatchaclub",
  logo: "/images/icons/pink_logo.png",
  defaultImage: "/images/about_matcha_banner.png"
};

// Page-specific SEO metadata
export const PAGE_SEO_DATA = {
  home: {
    title: "Umi Matcha - Best Organic Matcha from Japan in India",
    description: "Experience premium organic matcha from Japan. Ceremonial grade green tea powder for wellness, focus, and mindful living. Shop authentic Japanese matcha online in India.",
    keywords: "organic matcha, japanese matcha, matcha powder, green tea, ceremonial matcha, umi matcha, best matcha india",
    h1: "Premium Organic Matcha from Japan",
    canonical: "/",
    type: "website"
  },
  
  shop: {
    title: "Shop Premium Organic Matcha Online | Umi Matcha",
    description: "Shop premium organic matcha powder, traditional tea ceremony tools, and authentic Japanese matcha products. Free shipping across India. Ceremonial grade quality guaranteed.",
    keywords: "buy matcha online, organic matcha powder, matcha shop, japanese tea tools, ceremonial matcha, matcha whisk, matcha bowl",
    h1: "Shop Premium Organic Matcha & Tea Ceremony Tools",
    canonical: "/shop",
    type: "website"
  },
  
  about: {
    title: "About Umi Matcha - Our Journey & Japanese Tea Heritage",
    description: "Discover Umi Matcha's story of bringing authentic Japanese tea culture to India. Learn about our commitment to organic farming, traditional methods, and mindful living.",
    keywords: "umi matcha story, japanese tea culture, organic matcha farming, tea ceremony tradition, mindful living",
    h1: "Our Journey: Bringing Authentic Japanese Matcha to India",
    canonical: "/about",
    type: "website"
  },
  
  contact: {
    title: "Contact Umi Matcha - Customer Support & Inquiries",
    description: "Get in touch with Umi Matcha for product questions, wholesale inquiries, or customer support. We're here to help with your matcha journey.",
    keywords: "contact umi matcha, customer support, matcha questions, wholesale inquiry, tea consultation",
    h1: "Contact Us - We're Here to Help",
    canonical: "/contact",
    type: "website"
  },
  
  faq: {
    title: "Frequently Asked Questions | Umi Matcha",
    description: "Find answers to common questions about matcha preparation, health benefits, storage, shipping, and our products. Your matcha questions answered.",
    keywords: "matcha faq, how to prepare matcha, matcha benefits, matcha storage, shipping questions",
    h1: "Frequently Asked Questions About Matcha",
    canonical: "/faq",
    type: "website"
  },
  
  "our-matcha": {
    title: "Our Premium Japanese Matcha - Quality & Origins | Umi Matcha",
    description: "Learn about our premium organic matcha sourced directly from Japanese tea gardens. Discover the quality, origins, and traditional cultivation methods.",
    keywords: "japanese matcha quality, organic tea farming, matcha origins, ceremonial grade matcha, tea garden japan",
    h1: "Our Premium Japanese Matcha: Quality & Origins",
    canonical: "/our-matcha",
    type: "website"
  },
  
  "how-to-make-matcha-at-home": {
    title: "How to Make Perfect Matcha at Home - Step by Step Guide",
    description: "Learn the traditional Japanese way to prepare perfect matcha at home. Step-by-step guide with tips for the best taste and consistency.",
    keywords: "how to make matcha, matcha preparation, tea ceremony steps, matcha brewing guide, traditional matcha method",
    h1: "How to Make Perfect Matcha at Home",
    canonical: "/how-to-make-matcha-at-home",
    type: "article"
  },
  
  blogs: {
    title: "Matcha Blog - Health Benefits, Recipes & Tea Culture | Umi Matcha",
    description: "Explore our matcha blog for health benefits, delicious recipes, tea ceremony traditions, and wellness tips. Everything about matcha culture and lifestyle.",
    keywords: "matcha blog, matcha recipes, tea culture, matcha health benefits, wellness blog, japanese tea traditions",
    h1: "Matcha Blog - Culture, Health & Recipes",
    canonical: "/blogs",
    type: "website"
  },
  
  search: {
    title: "Search Products - Find Your Perfect Matcha | Umi Matcha",
    description: "Search our collection of premium matcha products, tea ceremony tools, and accessories. Find exactly what you're looking for.",
    keywords: "search matcha products, find matcha, product search, tea tools search",
    h1: "Search Our Matcha Collection",
    canonical: "/search",
    type: "website"
  },
  
  // Policy pages
  "terms-of-service": {
    title: "Terms of Service | Umi Matcha",
    description: "Read our terms of service for purchasing matcha products from Umi Matcha. Learn about our policies and user agreements.",
    keywords: "terms of service, user agreement, purchase terms, umi matcha policies",
    h1: "Terms of Service",
    canonical: "/terms-of-service",
    type: "website"
  },
  
  "privacy-policy": {
    title: "Privacy Policy | Umi Matcha",
    description: "Our privacy policy explains how we collect, use, and protect your personal information when you shop with Umi Matcha.",
    keywords: "privacy policy, data protection, personal information, customer privacy",
    h1: "Privacy Policy",
    canonical: "/privacy-policy",
    type: "website"
  },
  
  "refund-policy": {
    title: "Refund & Return Policy | Umi Matcha",
    description: "Learn about our refund and return policy for matcha products. Easy returns and customer satisfaction guaranteed.",
    keywords: "refund policy, return policy, money back guarantee, customer satisfaction",
    h1: "Refund & Return Policy",
    canonical: "/refund-policy",
    type: "website"
  },
  
  "shipping-policy": {
    title: "Shipping Information & Delivery Policy | Umi Matcha",
    description: "Information about shipping, delivery times, and shipping costs for matcha products across India and internationally.",
    keywords: "shipping policy, delivery information, shipping costs, international shipping",
    h1: "Shipping Information & Delivery Policy",
    canonical: "/shipping-policy",
    type: "website"
  }
};

// Product category SEO templates
export const PRODUCT_CATEGORY_SEO = {
  matcha: {
    titleTemplate: "{productName} - Premium Japanese Matcha | Umi Matcha",
    descriptionTemplate: "Shop {productName} - premium organic Japanese matcha powder. Ceremonial grade quality, authentic taste, and traditional preparation. Order online with free shipping.",
    keywordsTemplate: "{productName}, japanese matcha, organic matcha powder, ceremonial grade, {productName} online",
    h1Template: "{productName} - Premium Japanese Matcha"
  },
  
  matchaware: {
    titleTemplate: "{productName} - Authentic Japanese Tea Tools | Umi Matcha",
    descriptionTemplate: "Authentic {productName} for traditional Japanese tea ceremony. High-quality tea tools crafted for the perfect matcha experience. Shop genuine Japanese matchaware.",
    keywordsTemplate: "{productName}, japanese tea tools, matcha accessories, tea ceremony tools, authentic {productName}",
    h1Template: "{productName} - Authentic Japanese Tea Tool"
  },
  
  bundles: {
    titleTemplate: "{productName} - Complete Matcha Set | Umi Matcha",
    descriptionTemplate: "Complete {productName} with everything you need for the perfect matcha experience. Premium matcha powder and authentic Japanese tea tools in one set.",
    keywordsTemplate: "{productName}, matcha set, tea ceremony kit, complete matcha bundle, {productName} online",
    h1Template: "{productName} - Complete Matcha Experience Set"
  }
};

// Generate dynamic SEO data for products
export const generateProductSEO = (product) => {
  if (!product) return null;
  
  const productType = product.productType?.toLowerCase() || 'matcha';
  const template = PRODUCT_CATEGORY_SEO[productType] || PRODUCT_CATEGORY_SEO.matcha;
  
  const productName = product.title;
  const slug = product.handle || productName.toLowerCase().replace(/\s+/g, '-');
  
  return {
    title: template.titleTemplate.replace(/{productName}/g, productName),
    description: template.descriptionTemplate.replace(/{productName}/g, productName),
    keywords: template.keywordsTemplate.replace(/{productName}/g, productName),
    h1: template.h1Template.replace(/{productName}/g, productName),
    canonical: `/shop/${slug}`,
    type: "product",
    image: product.images?.edges?.[0]?.node?.url || SITE_CONFIG.defaultImage,
    price: product.variants?.edges?.[0]?.node?.price?.amount,
    availability: product.availableForSale ? "in_stock" : "out_of_stock"
  };
};

// Generate dynamic SEO data for blog posts
export const generateBlogSEO = (blogPost) => {
  if (!blogPost) return null;
  
  return {
    title: `${blogPost.title} | Umi Matcha Blog`,
    description: blogPost.excerpt || `Read about ${blogPost.title} on the Umi Matcha blog. Discover insights about matcha, wellness, and Japanese tea culture.`,
    keywords: `${blogPost.title}, matcha blog, tea culture, wellness, japanese tea, ${blogPost.tags?.join(', ') || ''}`,
    h1: blogPost.title,
    canonical: `/blogs/${blogPost.id || blogPost.slug}`,
    type: "article",
    image: blogPost.image || SITE_CONFIG.defaultImage,
    publishedTime: blogPost.publishedAt,
    modifiedTime: blogPost.updatedAt,
    author: blogPost.author || SITE_CONFIG.author
  };
};

// Utility function to get canonical URL
export const getCanonicalUrl = (path) => {
  return `${SITE_CONFIG.domain}${path}`;
};

// Utility function to get page SEO data
export const getPageSEO = (pathname) => {
  // Remove leading slash and trailing slash
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  
  // Handle home page
  if (!cleanPath) {
    return PAGE_SEO_DATA.home;
  }
  
  // Check for exact match first
  if (PAGE_SEO_DATA[cleanPath]) {
    return PAGE_SEO_DATA[cleanPath];
  }
  
  // Handle dynamic routes
  if (cleanPath.startsWith('shop/') && cleanPath !== 'shop') {
    // This is a product page, will be handled separately
    return null;
  }
  
  if (cleanPath.startsWith('blogs/') && cleanPath !== 'blogs') {
    // This is a blog post, will be handled separately
    return null;
  }
  
  // Return default if no match found
  return {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    keywords: SITE_CONFIG.defaultKeywords,
    h1: "Umi Matcha",
    canonical: `/${cleanPath}`,
    type: "website"
  };
};