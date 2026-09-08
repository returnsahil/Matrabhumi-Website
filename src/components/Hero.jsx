import { Link } from "react-router";
import architectureHero from "../assets/architecture-hero.png";
function Hero() {
  return (
    <section className="hero" id="home">
      <p className="hero-label">Building with purpose</p>
      <h2>For thoughtful modern spaces</h2>
      <img
        className="hero-image"
        src={architectureHero}
        alt="Modern home architectural concept"
      />
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
    </section>
  );
}

export default Hero;
