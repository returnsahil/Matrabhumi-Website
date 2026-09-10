import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import "./Contact.css";

function Contact() {
  return (
    <section
      className="contact-page"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <header className="contact-intro">
        <p className="contact-label">Contact Matrabhumi</p>
        <h1 id="contact-heading">Let&apos;s talk about your project.</h1>
        <p>
          Speak directly with the people responsible for building your home.
        </p>
      </header>

      <div className="contact-options" aria-label="Contact options">
        <a
          className="contact-option"
          href="tel:+917470892677"
          aria-label="Call Dhruv Lobaniya at plus 91 74708 92677"
        >
          <FaPhone aria-hidden="true" />
          <span>
            <small>Dhruv Lobaniya</small>
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
            <small>WhatsApp</small>
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
            <small>Mr. Kailash Lobaniya</small>
            +91 75420 28741
          </span>
        </a>
      </div>

      <div className="contact-socials">
        <p>Follow Matrabhumi</p>
        <div className="social-buttons" aria-label="Social media links">
          <button
            type="button"
            disabled
            aria-label="Instagram link coming soon"
          >
            <FaInstagram aria-hidden="true" />
            <span>Instagram</span>
          </button>
          <button type="button" disabled aria-label="X link coming soon">
            <FaXTwitter aria-hidden="true" />
            <span>X</span>
          </button>
          <button type="button" disabled aria-label="Facebook link coming soon">
            <FaFacebookF aria-hidden="true" />
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Contact;
