import "./Contact.scss";
import { useTheme } from "@mui/material/styles";
import contactbg from "../../assets/images/vectors/contact_bg.png";
import callingNeko from "../../assets/images/vectors/neko/calling.png";

const Contact = () => {
  const theme = useTheme();

  return (
    <section
      className="contact-section"
      style={{ backgroundColor: theme.colors.green }}
    >
      <div className="contact-container">
        <img src={contactbg} alt="" />
        <div className="inner-container">
          <div className="links-section">
            <a className="link" href="tel:+919568480048">
              +91 9568480048
            </a>
            <a
              className="link"
              href="https://www.instagram.com/umimatcha.ig/"
              target="_blank"
            >
              @umimatcha.ig
            </a>
            <a className="link" href="mailto:hello@umimatchashop.com">
              hello@umimatchashop.com
            </a>
          </div>
          <div className="neko">
            <img src={callingNeko} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
