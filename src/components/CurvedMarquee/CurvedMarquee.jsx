import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./CurvedMarquee.scss";

const CurvedMarquee = () => {
  const pathRef = useRef(null);
  const textPathRef = useRef(null);

  useEffect(() => {
    const pathLength = pathRef.current.getTotalLength();

    gsap.to(textPathRef.current, {
      attr: { startOffset: -pathLength + 300 },
      repeat: -1,
      ease: "none",
      duration: 15,
    });
  }, []);

  return (
    <div className="curved-marquee">
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
        <defs>
          <path
            id="curve"
            ref={pathRef}
            d="M0,110 C300,0 800,200 1200,100"
            fill="none"
          />
        </defs>

        {/* Curved Background Path */}
        <use
          href="#curve"
          stroke="#f79995" // soft pink
          strokeWidth="55" // thickness of the ribbon
          fill="none"
          strokeLinecap="round"
        />

        {/* Flowing Text */}
        <text dy="10">
          <textPath
            ref={textPathRef}
            href="#curve"
            startOffset="0"
            textLength="3800"
            spacing="auto"
          >
            * matcha your flow * matcha your flow * matcha your flow * matcha
            your flow * matcha your flow * matcha your flow * matcha your flow *
            matcha your flow * matcha your flow * matcha your flow * matcha your
            flow * matcha your flow *
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedMarquee;
