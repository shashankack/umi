import "./ProductsSection.scss";
import { useTheme } from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { FaShoppingCart } from "react-icons/fa";
import windowImage from "../../assets/images/vectors/products/window.png";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
import { fetchShopifyProducts } from "../../utils/shopify";
import CurvedMarquee from "../CurvedMarquee/CurvedMarquee";

const ProductsSection = () => {
  const theme = useTheme();
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

  return (
    <section
      className="products-section"
      style={{
        backgroundColor: theme.colors.beige,
        fontFamily: theme.fonts.text,
      }}
    >
      <h3 className="title" style={{ color: theme.colors.pink }}>
        DISCOVER OUR <br />
        PRODUCTS
      </h3>

      <Swiper
        modules={[FreeMode, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        freeMode={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="products-slider"
      >
        {products.map((product) => {
          const imageUrl = product.images.edges[0]?.node.url;
          const price = product.variants.edges[0]?.node.price.amount;
          const currency = product.variants.edges[0]?.node.price.currencyCode;

          return (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <img
                  src={windowImage}
                  alt="Product Window"
                  className="product-window"
                />
                <div className="product-image">
                  <img src={imageUrl} alt={product.title} />
                </div>

                <div className="product-overlay">
                  <div className="price" style={{ color: theme.colors.beige }}>
                    {currency} {price}
                  </div>
                  <div className="cart-icon">
                    <FaShoppingCart color={theme.colors.beige} size={20} />
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
