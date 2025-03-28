import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { gsap } from "gsap";
import productWindow from "../../assets/images/vectors/product_window.png";
import sakura from "../../assets/images/vectors/sakura.png";
import "./HeroSection.scss";
import checkered from "../../assets/images/vectors/checkered.png";
import {
  fetchShopifyProducts,
  createShopifyCheckout,
} from "../../utils/shopify";
import Loading from "../Loading/Loading";

const HeroSection = ({ theme }) => {
  const imageRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const originRef = useRef(null);
  const sakuraRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleSlide(1);
    }, 5000);
  };

  useEffect(() => {
    if (!products.length) return;

    // Wait for refs to be attached to DOM
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    intervalRef.current = setInterval(() => {
      handleSlide(1);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [products]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    loadProducts();
  }, []);

  const animateOut = (direction = 1) => {
    const tl = gsap.timeline();

    tl.to([nameRef.current, descRef.current, originRef.current], {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: "power1.in",
    });

    tl.to(
      imageRef.current,
      {
        x: direction * 100,
        rotate: direction * 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "<"
    );

    tl.to(
      sakuraRef.current,
      {
        rotate: `+=${direction * 180}`, // rotates clockwise/counterclockwise
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<"
    );
  };

  const animateIn = (direction = 1) => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      {
        x: -direction * 100,
        rotate: -direction * 20,
        opacity: 0,
      },
      {
        x: 0,
        rotate: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    tl.fromTo(
      [nameRef.current, descRef.current, originRef.current],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.3"
    );
  };

  const handleSlide = (dir) => {
    animateOut(dir);
    setTimeout(() => {
      setCurrent((prev) => {
        const nextIndex =
          dir === 1
            ? (prev + 1) % products.length
            : (prev - 1 + products.length) % products.length;
        return nextIndex;
      });
      setTimeout(() => animateIn(dir), 50);
    }, 300);
  };

  const nextSlide = () => {
    resetAutoSlide();
    handleSlide(1);
  };

  const prevSlide = () => {
    resetAutoSlide();
    handleSlide(-1);
  };

  const handleBuyNow = async () => {
    const currentProduct = products[current];
    const variantId = currentProduct.variants.edges[0]?.node.id;

    if (!variantId) return;

    const checkoutUrl = await createShopifyCheckout(variantId);
    window.location.href = checkoutUrl;
  };

  if (products.length === 0) return <Loading />;

  const currentProduct = products[current];
  const imageUrl = currentProduct.images.edges[0]?.node.url;

  return (
    <section
      className="hero-section"
      style={{ backgroundColor: theme.colors.pink }}
    >
      <div className="hero-content">
        <div className="home-text" style={{ color: theme.colors.beige }}>
          <h2>UMI IS</h2>
          <h2>SO MATCHA</h2>
          <h2>BETTER</h2>
        </div>

        <div
          className="product-window"
          style={{ fontFamily: theme.fonts.text }}
        >
          <img
            src={productWindow}
            alt="Product Frame"
            className="product-frame"
          />

          <div className="slider">
            <div className="arrow left" onClick={prevSlide}>
              <FaArrowLeft color={theme.colors.pink} />
            </div>

            <h3 className="product-name" ref={nameRef}>
              {currentProduct.title}
            </h3>

            <img
              ref={imageRef}
              src={imageUrl}
              alt={currentProduct.title}
              className="product-img"
            />

            <div className="arrow right" onClick={nextSlide}>
              <FaArrowRight color={theme.colors.pink} />
            </div>

            <div className="product-info">
              <div className="text-grid">
                <div className="grid-item" ref={descRef}>
                  {currentProduct.description}
                </div>
                <div
                  className="grid-item"
                  ref={originRef}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Price:</strong> ${currentProduct.variants.edges[0]?.node.price.amount} ${currentProduct.variants.edges[0]?.node.price.currencyCode}`,
                  }}
                />
                <div
                  className="grid-item flower"
                  onClick={handleBuyNow}
                  style={{ cursor: "pointer" }}
                >
                  <img src={sakura} alt="flower" ref={sakuraRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className="checkered" src={checkered} alt="" />
    </section>
  );
};

export default HeroSection;
