import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./CurvedMarquee.scss";

const CurvedMarquee = () => {
  const pathRef = useRef(null);
  const textPathRef = useRef(null);
  const [isMobile] = useState(window.innerWidth <= 500 ? true : false);

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
      {isMobile ? (
        <svg viewBox="0 0 550 73">
          <defs>
            <path
              id="curve"
              ref={pathRef}
              d="M0,160 C900, 20 640,370 1400,90"
              fill="none"
            />
          </defs>

          {/* Curved Background Path */}
          <use
            href="#curve"
            stroke="#f79995" // soft pink
            strokeWidth="15" // thickness of the ribbon
            fill="none"
            strokeLinecap="round"
          />

          {/* Flowing Text */}
          <text dy="8">
            <textPath
              ref={textPathRef}
              href="#curve"
              startOffset="0"
              textLength="3500"
              spacing="auto"
            >
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow * matcha your flow * matcha your flow
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow *
            </textPath>
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <path
              id="curve"
              ref={pathRef}
              d="M0,130 C500,0 700,200 1200,100"
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
              your flow * matcha your flow * matcha your flow * matcha your flow
              * matcha your flow * matcha your flow * matcha your flow * matcha
              your flow * matcha your flow *
            </textPath>
          </text>
        </svg>
      )}
    </div>
  );
};

export default CurvedMarquee;
