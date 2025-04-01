import "./ProductsSection.scss";
import { useTheme } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { FaShoppingCart } from "react-icons/fa";
import windowImage from "../../assets/images/vectors/products/window.png";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEffect, useRef, useState } from "react";
import { fetchShopifyProducts } from "../../utils/shopify";
import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
  const theme = useTheme();
  const titleRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
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

      return () => {
        titleAnimation.kill();
      };
    }
  });

  return (
    <section
      className="products-section"
      style={{
        backgroundColor: theme.colors.beige,
        fontFamily: theme.fonts.text,
      }}
    >
      <h3 className="title" style={{ color: theme.colors.pink }} ref={titleRef}>
        DISCOVER OUR <br />
        PRODUCTS
      </h3>

      <Swiper
        modules={[FreeMode, Pagination, Autoplay]}
        spaceBetween={10}
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

                  <p className="learn-more">Learn More</p>

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
    </section>
  );
};

export default ProductsSection;
