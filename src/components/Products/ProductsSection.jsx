import "./ProductsSection.scss";
import { useTheme } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";

import { FaShoppingCart } from "react-icons/fa";

import { useCart } from "../../context/CartContext";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useResponsive, useHydration } from "../../hooks/useHydration";

import surfingNeko from "../../assets/images/vectors/neko/surfing.gif";
import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
  const theme = useTheme();
  const titleRef = useRef(null);
  const svgRef = useRef(null);
  const isMobile = useResponsive(768);
  const isHydrated = useHydration();
  const [hasPlayed] = useState(sessionStorage.getItem("hasPlayed") === "true");
  const { products, loading } = useProducts();
  const { addItem } = useCart();

  useEffect(() => {
    if (!isHydrated) return;

    const setupAnimations = () => {
      if (!titleRef.current) return;

      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === titleRef.current || t.trigger === svgRef.current) {
          t.kill();
        }
      });

      // Refresh ScrollTrigger to ensure accurate calculations
      ScrollTrigger.refresh();

      // Check if we're near the section for better trigger positioning
      const sectionTop =
        titleRef.current.getBoundingClientRect().top + window.scrollY;
      const isNearSection = window.scrollY > sectionTop - window.innerHeight;

      const titleAnimation = gsap.fromTo(
        titleRef.current,
        { y: "50%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: isNearSection ? "top 85%" : "top 80%",
            toggleActions: "play none none none",
            refreshPriority: -1,
            invalidateOnRefresh: true,
          },
        }
      );

      if (svgRef.current) {
        gsap.fromTo(
          svgRef.current,
          { height: "70%" },
          {
            height: isMobile ? "145%" : "150%",
            duration: 1.4,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: svgRef.current,
              start: isNearSection ? "top 85%" : "top 80%",
              toggleActions: "play none none none",
              refreshPriority: -1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      return titleAnimation;
    };

    // Use multiple frames and delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(setupAnimations);
        });
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === titleRef.current || t.trigger === svgRef.current) {
          t.kill();
        }
      });
    };
  }, [isHydrated, isMobile]);

  // Add resize handler to refresh ScrollTrigger when window dimensions change
  useEffect(() => {
    if (!isHydrated) return;

    let resizeTimeout;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Only refresh if refs are still mounted
        if (titleRef.current || svgRef.current) {
          ScrollTrigger.refresh();
        }
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isHydrated]);

  // Refresh ScrollTrigger after hydration to ensure accurate calculations
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => clearTimeout(timer);
  }, [isHydrated]);

  return (
    <section
      className="products-section"
      id="shop"
      style={{
        backgroundColor: theme.colors.beige,
        fontFamily: theme.fonts.text,
      }}
    >
      <div className="top">
        <h2>Ride the wave</h2>
        <h2>with umi</h2>
        <div className="image-container">
          <img src={surfingNeko} alt="Surfing Neko" className="neko" />
        </div>
        <button onClick={() => (window.location.href = "/shop")}>
          Shop Now
        </button>
      </div>
      <h3
        className="title"
        style={{
          color: theme.colors.pink,
          fontSize: isMobile ? "32px" : "30px",
          zIndex: 5,
          textAlign: "center",
          marginTop: isMobile ? "50px" : "100px",
        }}
        ref={titleRef}
      >
        DISCOVER OUR <br /> PRODUCTS
      </h3>

      {/* Only render Swiper when products are loaded and we have at least 1 product */}
      {!loading && products.length > 0 && (
        <Swiper
          modules={[FreeMode, Navigation, Autoplay]}
          slidesPerView={3}
          navigation={{ clickable: true }}
          loop={products.length >= 6} // Only enable loop if we have enough slides
          breakpoints={{
            320: {
              slidesPerView: 1,
              loop: products.length >= 3, // Need at least 3 slides for loop with slidesPerView: 1
            },
            640: {
              slidesPerView: 2,
              loop: products.length >= 4, // Need at least 4 slides for loop with slidesPerView: 2
            },
            1024: {
              slidesPerView: 3,
              loop: products.length >= 6, // Need at least 6 slides for loop with slidesPerView: 3
            },
          }}
          autoplay={products.length >= 3 ? { delay: 3000 } : false} // Only autoplay if we have enough slides
          className="products-slider"
        >
          {products.map((product) => {
            const title = product.title;
            const imageUrl = product.images.edges[0]?.node.url;
            // const price = product.variants.edges[0]?.node.price.amount;
            const price = "Coming Soon";
            const variantId = product.variants.edges[0]?.node.id;
            const productId = product.id.split("/").pop();

            return (
              <SwiperSlide key={product.id}>
                <div className="product-card">
                  <div className="title">
                    <h2
                      style={{
                        fontSize: isMobile ? "16px" : "18px",
                        color: theme.colors.green,
                      }}
                    >
                      {title}
                    </h2>
                  </div>
                  <div className="rect" />
                  <div className="product-image">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      onClick={() =>
                        (window.location.href = `/product/${productId}`)
                      }
                    />
                  </div>

                  <div
                    className="product-actions"
                    style={{ color: theme.colors.beige }}
                  >
                    <div className="price">{price}</div>

                    <div
                      className="cart-icon"
                      style={{ cursor: "pointer" }}
                      // onClick={() => addItem(variantId, 1)}
                    >
                      <FaShoppingCart size={20} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Loading state */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: theme.colors.pink,
          }}
        >
          Loading products...
        </div>
      )}

      {/* No products state */}
      {!loading && products.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: theme.colors.pink,
          }}
        >
          No products available
        </div>
      )}
      <div className="bottom">
        <svg
          ref={svgRef}
          width={isMobile ? "300%" : "100vw"}
          height={isMobile ? "150%" : "100%"}
          viewBox="0 0 1440 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <path fill="#F3EDB8">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
      M0,100 
      C180,120 360,90 540,100 
      C720,110 900,90 1080,100 
      C1260,110 1440,90 1620,100 
      L1440,200 L0,200 Z;

      M-180,100 
      C0,120 190,90 360,100 
      C540,110 720,90 900,100 
      C1080,110 1260,90 1440,100 
      L1440,200 L0,200 Z;

      M0,100 
      C180,120 360,90 540,100 
      C720,110 900,90 1080,100 
      C1260,110 1440,90 1620,100 
      L1440,200 L0,200 Z
    "
            />
          </path>
        </svg>
      </div>
      <div
        className="curved-marquee-container"
        style={{
          position: "absolute",
          bottom: isMobile ? -100 : -150,
          left: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <CurvedMarquee />
      </div>
    </section>
  );
};

export default ProductsSection;
