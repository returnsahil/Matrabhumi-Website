import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Link className="footer-brand" to="/" aria-label="Matrabhumi home">
            Matrabhumi
          </Link>
          <p>Thoughtful homes built with honesty, care, and purpose.</p>
        </div>

        <nav className="footer-column" aria-label="Footer navigation">
          <h2>Explore</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <address className="footer-column footer-contact">
          <h2>Contact</h2>
          <a href="tel:+917470892677">
            <span>Dhruv Lobaniya</span>
            +91 74708 92677
          </a>
          <a
            href="https://wa.me/917770819697"
            target="_blank"
            rel="noreferrer"
          >
            <span>Business WhatsApp</span>
            +91 77708 19697
          </a>
          <a href="tel:+917542028741">
            <span>Mr. Kailash Lobaniya</span>
            +91 75420 28741
          </a>
        </address>

        <div className="footer-column footer-socials">
          <h2>Follow</h2>
          <div aria-label="Social media links">
            <button type="button" disabled aria-label="Instagram link coming soon">
              <FaInstagram aria-hidden="true" />
            </button>
            <button type="button" disabled aria-label="X link coming soon">
              <FaXTwitter aria-hidden="true" />
            </button>
            <button type="button" disabled aria-label="Facebook link coming soon">
              <FaFacebookF aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Matrabhumi. All rights reserved.</p>
        <p>
          Designed and developed by <span>Sahil Mandloi</span>.
        </p>
      </div>
    </footer>
  )
}

export default Footer
