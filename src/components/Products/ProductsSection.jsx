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
import { fetchShopifyProducts } from "../../utils/shopify";

import surfingNeko from "../../assets/images/vectors/neko/surfing.gif";
import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
  const theme = useTheme();
  const titleRef = useRef(null);
  const svgRef = useRef(null);
  const [isMobile] = useState(window.innerWidth <= 768 ? true : false);
  const [hasPlayed] = useState(sessionStorage.getItem("hasPlayed") === "true");
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    console.log(hasPlayed);
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
        console.log("Incoming products data:", data);
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
        { y: "50%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
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
              start: "top 80%",
              toggleActions: "play none none reverse",
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

      <Swiper
        modules={[FreeMode, Navigation, Autoplay]}
        slidesPerView={3}
        navigation={{ clickable: true }}
        loop
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
        autoplay={{ delay: 3000 }}
        className="products-slider"
      >
        {products.map((product) => {
          const title = product.title;
          const imageUrl = product.images.edges[0]?.node.url;
          const price = product.variants.edges[0]?.node.price.amount;
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
                  <div className="price">₹ {price}</div>

                  <div
                    className="cart-icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => addItem(variantId, 1)}
                  >
                    <FaShoppingCart size={20} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
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
