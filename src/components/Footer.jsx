import { Link } from "react-router";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer({ copy, navCopy, brand }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Link className="footer-brand" to="/" aria-label="Matrabhumi home">
            <img
              src="/brand/Matrabhumi-logo-web.png"
              alt=""
              width="30"
              height="30"
              aria-hidden="true"
            />
            <span>{brand}</span>
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
