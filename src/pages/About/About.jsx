import "./About.scss";
import neko from "../../assets/images/neko.gif";
import founder from "../../assets/images/founder.jpg";
import { useTheme } from "styled-components";

const About = () => {
  const theme = useTheme();
  return (
    <section
      className="about-page"
      style={{ backgroundColor: theme.colors.green }}
    >
      <div className="top">
        <div className="neko">
          <img src={neko} alt="" />
        </div>

        <div className="about-text">
          <div className="title-bubble">
            <h2>About Us</h2>
          </div>

          <div className="content">
            <p>Umi 海 comes from the Japanese word ocean. </p>
            <p>
              Umi matcha was inspired by the famous Japanese painting, "The
              Great Wave of Kanagawa". Matcha has been a constant in my life
              through its highest highs and lowest lows and just like that, the
              great wave depicts life's journey. It is a never-ending process
              where once we conquer our fear and meet our goal, we'll be met
              again with other vicious waves, other bigger problems &
              difficulties. However, our tiredness towards the journey will also
              have it's sweetness, when we reach a calm sea, where it's wave is
              gentle, and we can feel the summer breeze warm our mind, body, and
              soul. But, with the knowledge that another wave is waiting to be
              conquered. Umi Matcha represents a symbolic shift within the
              matcha community.
            </p>
            <p>
              I'm thrilled to have Umi become a part of your daily routine
              because it's truly the most magical part of mine.
            </p>
            <p>- Adviti, Founder</p>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="founder-image">
          <img src={founder} />
        </div>
        <div className="founder-text">
          <p>Umi 海 comes from the Japanese word ocean. </p>
          <p>
            Umi matcha was inspired by the famous Japanese painting, "The Great
            Wave of Kanagawa". Matcha has been a constant in my life through its
            highest highs and lowest lows and just like that, the great wave
            depicts life's journey. It is a never-ending process where once we
            conquer our fear and meet our goal, we'll be met again with other
            vicious waves, other bigger problems & difficulties. However, our
            tiredness towards the journey will also have it's sweetness, when we
            reach a calm sea, where it's wave is gentle, and we can feel the
            summer breeze warm our mind, body, and soul. But, with the knowledge
            that another wave is waiting to be conquered. Umi Matcha represents
            a symbolic shift within the matcha community.
          </p>
          <p>
            I'm thrilled to have Umi become a part of your daily routine because
            it's truly the most magical part of mine.
          </p>
          <p>- Adviti, Founder</p>
        </div>
      </div>
    </section>
  );
};

export default About;
