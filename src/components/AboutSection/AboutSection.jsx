import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCreative,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./AboutSection.scss";
import { useTheme } from "@mui/material/styles";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import cloud from "../../assets/images/vectors/cloud.png";
import paw from "../../assets/images/vectors/paw.png";

import matchaField from "../../assets/images/matcha_field.png";

gsap.registerPlugin(ScrollTrigger);
const AboutSection = () => {
  const images = [
    matchaField,
    matchaField,
    matchaField,
    matchaField,
    matchaField,
  ];

  const theme = useTheme();

  useEffect(() => {
    gsap.fromTo(
      ".cloud",
      { scale: 4, opacity: 0, y: -350 },
      {
        y: 150,
        scale: 1,
        opacity: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cloud",
          start: "top+=500 top",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.utils.toArray(".about-content p, .text-content p").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  });

  return (
    <section
      className="about-section"
      style={{
        backgroundColor: theme.colors.green,
      }}
    >
      <div className="about-content" style={{ color: theme.colors.beige }}>
        <h2>About our matcha</h2>
        <p>Life comes in waves, matcha your flow</p>
        <p>Umi: wave </p>
        <p>
          Umi is a premium matcha brand that is crafted from the finest,
          single-origin, and single-cultivar tea leaves that are spring 1st
          flush harvest sourced exclusively from Japan's most renowned
          matcha-growing regions. Cultivated with meticulous care, our matcha is
          100% certified organic, free of pesticides, herbicides and synthetic
          fertilisers ensuring a clean product that retains its natural purity
          and vibrant green colour. Each batch is harvested from a single
          cultivar, allowing for a distinct, consistent flavour profile that
          reflects the terroir of its origin. With a smooth, umami-rich taste
          and a silky texture, our matcha is ideal for both traditional
          ceremonial use and contemporary culinary applications. Perfect for
          discerning matcha enthusiasts seeking exceptional quality in every
          sip.
        </p>
        <p>
          Umi is a premium matcha brand crafted from the finest, single-origin,
          and single-cultivar tea leaves, harvested during the first flush of
          spring from Japan's most renowned matcha-growing regions. Cultivated
          with meticulous care, our matcha is 100% certified organic, free of
          pesticides, herbicides, and synthetic fertilizers, ensuring a clean
          product that retains its natural purity and vibrant green color. Each
          batch is harvested from a single cultivar, allowing for a distinct,
          consistent flavour profile that reflects the terroir of its origin.
          With a smooth, umami-rich taste and a silky texture, our matcha is
          ideal for both traditional ceremonial use and contemporary culinary
          applications—perfect for discerning matcha enthusiasts seeking
          exceptional quality in every sip.
        </p>
        <p>
          Our matcha represents a symbolic change within the matcha community.
          We hope for our matcha to stay with you through life’s highest highs
          and lowest lows. Made with love by matcha lovers, for matcha lovers.
        </p>
      </div>
      <div className="image-slider">
        <div className="cloud">
          <img src={cloud} alt="" />
        </div>
        <Swiper
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
          }}
          navigation={{
            nextEl: ".next-icon",
            prevEl: ".prev-icon",
          }}
          effect={"creative"}
          loop
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Navigation, Autoplay]}
          style={{
            height: "100%",
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Matcha ${index}`} />
            </SwiperSlide>
          ))}

          <div className="next-icon">
            <img src={paw} />
          </div>
          <div className="prev-icon">
            <img src={paw} />
          </div>
        </Swiper>
      </div>
      <div className="text-content" style={{ color: theme.colors.beige }}>
        <p>
          Nestled in the misty hills of Japan, our Matcha farm is a sanctuary of
          tradition and purity. We cultivate shade-grown tea leaves using
          time-honored organic practices passed down through generations.
        </p>
        <p>
          Every leaf is hand-picked to ensure only the youngest, most vibrant
          greens make it into our Matcha. Our soil is enriched naturally,
          without chemicals, preserving both the earth and the plant's
          nutrients. We believe in slow farming — letting nature take its course
          for deeper flavor and richer antioxidants. From field to stone mill,
          each step is handled with precision and care.
        </p>
        <p>
          The result is a velvety, ceremonial-grade Matcha that nourishes body
          and mind.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
