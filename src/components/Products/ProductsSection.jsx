import "./ProductsSection.scss";
import { useTheme } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef, useState } from "react";
import { fetchShopifyProducts } from "../../utils/shopify";
import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";

import surfingNeko from "../../assets/images/vectors/neko/surfing.png";

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
  const theme = useTheme();
  const titleRef = useRef(null);
  const svgRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
        console.log("Incoming products data:", data); // Log the incoming data
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      const titleAnimation = gsap.fromTo(
        titleRef.current,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            scrub: 1,
          },
        }
      );

      if (svgRef.current) {
        gsap.fromTo(
          svgRef.current,
          { height: "60%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: svgRef.current,
              start: "top bottom",
              end: "bottom bottom ",
              scrub: 3,
            },
          }
        );
      }

      return () => {
        titleAnimation.kill();
      };
    }
  }, []);

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
        <div className="image-container">
          <img src={surfingNeko} alt="Surfing Neko" className="neko" />
        </div>
        <h2>Ride the wave</h2>
        <h2>with umi</h2>
        <button>Shop Now</button>
      </div>
      <h3 className="title" style={{ color: theme.colors.pink }} ref={titleRef}>
        DISCOVER OUR <br />
        PRODUCTS
      </h3>

      <Swiper
        modules={[FreeMode, Pagination, Autoplay]}
        slidesPerView={3}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="products-slider"
      >
        {products.map((product) => {
          const title = product.title;
          const imageUrl = product.images.edges[0]?.node.url;
          const price = product.variants.edges[0]?.node.price.amount;
          const currency = product.variants.edges[0]?.node.price.currencyCode;

          // Extract the numeric product ID
          const productId = product.id.split("/").pop(); // Get the numeric ID

          return (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <div className="title">
                  <h2>{title}</h2>
                </div>
                <div className="rect" />
                <div className="product-image">
                  <img src={imageUrl} alt={product.title} />
                </div>

                <div
                  className="product-actions"
                  style={{ color: theme.colors.beige }}
                >
                  <div className="price">
                    {currency} {price}
                  </div>

                  <Link to={`/product/${productId}`} className="learn-more">
                    Learn More
                  </Link>

                  <div className="cart-icon">
                    <FaShoppingCart size={20} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="marquee">
        <CurvedMarquee />
      </div>
      <svg
        ref={svgRef}
        width="100vw"
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
    </section>
  );
};

export default ProductsSection;
