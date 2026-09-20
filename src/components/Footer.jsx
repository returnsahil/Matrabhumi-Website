import { Link } from "react-router";

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
