import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer({ copy, navCopy, brand }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Link className="footer-brand" to="/" aria-label="Matrabhumi home">
            {brand}
          </Link>
          <p>{copy.description}</p>
        </div>

        <nav className="footer-column" aria-label="Footer navigation">
          <h2>{copy.explore}</h2>
          <ul>
            <li>
              <Link to="/">{navCopy.home}</Link>
            </li>
            <li>
              <Link to="/about">{navCopy.about}</Link>
            </li>
            <li>
              <Link to="/projects">{navCopy.projects}</Link>
            </li>
            <li>
              <Link to="/contact">{navCopy.contact}</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-column footer-socials">
          <h2>{copy.follow}</h2>
          <div aria-label="Social media links">
            <button
              type="button"
              disabled
              aria-label="Instagram link coming soon"
            >
              <FaInstagram aria-hidden="true" />
            </button>
            <button type="button" disabled aria-label="X link coming soon">
              <FaXTwitter aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              aria-label="Facebook link coming soon"
            >
              <FaFacebookF aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{copy.rights}</p>
        <p>
          {copy.credit} <span>Sahil Mandloi</span>.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
