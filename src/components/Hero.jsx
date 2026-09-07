import { Link } from "react-router";

function Hero() {
  return (
    <section className="hero" id="home">
      <p className="hero-label">Building with purpose</p>
      <h2>For thoughtful modern spaces</h2>
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
