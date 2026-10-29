import {
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router";
import "./Contact.css";

function Contact({ copy, brand, homeLabel, navCopy }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className="contact-page"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-visual">
        <Link className="contact-home" to="/" aria-label={homeLabel}>
          <img
            src="/brand/Matrabhumi-logo-web.png"
            alt=""
            width="48"
            height="48"
            aria-hidden="true"
          />
          <span className="contact-home-name">{brand}</span>
        </Link>
        <svg
          className="contact-architecture"
          viewBox="0 0 700 900"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path d="M105 750V260L350 112L595 260V750" />
          <path d="M105 260H595M178 750V330H522V750" />
          <path d="M258 750V435H442V750M258 435H442" />
          <path d="M80 750H620M80 792H620M178 330L350 228L522 330" />
          <path d="M105 505H258M442 505H595M105 640H258M442 640H595" />
          <path d="M350 112V70M84 260H58M642 260H616" />
        </svg>
      </div>

      <button
        className="contact-menu-toggle"
        type="button"
        aria-label={menuOpen ? navCopy.closeMenu : navCopy.openMenu}
        aria-expanded={menuOpen}
        aria-controls="contact-navigation"
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span className="contact-menu-label">{copy.menu}</span>
        <span className="contact-menu-mark" aria-hidden="true">
          {menuOpen ? "×" : "◆"}
        </span>
      </button>
      <nav
        id="contact-navigation"
        className="contact-navigation"
        aria-label={navCopy.navigation}
        hidden={!menuOpen}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>{navCopy.home}</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>{navCopy.about}</Link>
        <Link to="/projects" onClick={() => setMenuOpen(false)}>{navCopy.projects}</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>{navCopy.contact}</Link>
      </nav>

      <div className="contact-content">
        <header className="contact-intro">
          <p className="contact-label">{copy.label}</p>
          <h1 id="contact-heading">{copy.title}</h1>
          <p className="contact-lead">{copy.heading}</p>
          <p className="contact-description">{copy.intro}</p>
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
            <span className="contact-option-arrow" aria-hidden="true">↗</span>
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
            <span className="contact-option-arrow" aria-hidden="true">↗</span>
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
            <span className="contact-option-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <address className="contact-address">
          <small>{copy.office}</small>
          <span>{copy.address}</span>
        </address>

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
      </div>
    </section>
  );
}

export default Contact;
