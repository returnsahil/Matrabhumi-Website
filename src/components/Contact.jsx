import {
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import "./Contact.css";

function Contact({ copy }) {
  return (
    <section
      className="contact-page"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <header className="contact-intro">
        <p className="contact-label">{copy.label}</p>
        <h1 id="contact-heading">{copy.heading}</h1>
        <p>{copy.intro}</p>
      </header>

      <div className="contact-options" aria-label={copy.options}>
        <a
          className="contact-option"
          href="tel:+917470892677"
          aria-label="Call Dhruv Lobaniya at plus 91 74708 92677"
        >
          <FaPhone aria-hidden="true" />
          <span>
            <small>{copy.dhruv}</small>
            +91 74708 92677
          </span>
        </a>

        <a
          className="contact-option contact-option--whatsapp"
          href="https://wa.me/917770819697"
          target="_blank"
          rel="noreferrer"
          aria-label="Message Matrabhumi on WhatsApp at plus 91 77708 19697"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>
            <small>{copy.whatsapp}</small>
            +91 77708 19697
          </span>
        </a>

        <a
          className="contact-option"
          href="tel:+917542028741"
          aria-label="Call Mr. Kailash Lobaniya at plus 91 75420 28741"
        >
          <FaPhone aria-hidden="true" />
          <span>
            <small>{copy.kailash}</small>
            +91 75420 28741
          </span>
        </a>
      </div>

      <div className="contact-socials">
        <p>{copy.follow}</p>
        <div className="social-buttons" aria-label={copy.socials}>
          <a
            href="https://www.instagram.com/matrabhumi_construction_indore/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Matrabhumi Construction on Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>
          <a
            href="https://x.com/matrabhumipoint"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Matrabhumi on X"
          >
            <FaXTwitter aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
