import "./TutorialSection.scss";
import { useTheme } from "styled-components";

import step1 from "../../assets/images/vectors/about/step1.png";
import step2 from "../../assets/images/vectors/about/step2.png";
import step3 from "../../assets/images/vectors/about/step3.png";
import step4 from "../../assets/images/vectors/about/step4.png";

const TutorialSection = () => {
  const theme = useTheme();
  const stepsImages = [
    {
      image: step1,
      text: "Sift 1-2 tsp of umi matcha into a bowl.",
    },
    {
      image: step2,
      text: "Add 80ml of warm water and whisk until smooth.",
    },
    {
      image: step3,
      text: "Pour milk of your choice.",
    },
    {
      image: step4,
      text: "Add sweetner ofyour choice.",
    },
  ];

  return (
    <section
      className="tutorial-section"
      style={{ backgroundColor: theme.colors.pink }}
    >
      <div
        className="title-wrapper"
        style={{
          color: theme.colors.pink,
          backgroundColor: theme.colors.beige,
        }}
      >
        <h2>Brew it the Umi way</h2>
      </div>
      <div className="steps">
        {stepsImages.map((step, index) => (
          <div className="step" key={index}>
            <img src={step.image} alt="" />
            <p
              style={{
                color: theme.colors.beige,
              }}
            >
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorialSection;
