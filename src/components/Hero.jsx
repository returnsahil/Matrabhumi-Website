import { Link } from "react-router";
import architectureHero from "../assets/architecture-hero.png";
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-label">Building with purpose</p>
        <h2 className="hero-heading">For thoughtful modern spaces</h2>

        <p className="hero-description">
          Matrabhumi dosen't just build, it brings to life places that feel like
          Home.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/projects">
            View our projects
          </Link>
          <Link className="secondary-button" to="/contact">
            Contact us
          </Link>
        </div>
      </div>
      <img
        className="hero-image"
        src={architectureHero}
        alt="Modern home architectural concept"
      />
    </section>
  );
}

export default Hero;
