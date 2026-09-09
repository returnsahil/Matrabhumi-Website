import { Link } from "react-router";
import architectureHero from "../assets/architecture-hero.png";
import house1 from "../assets/projects/modern-house-01.png";
import house2 from "../assets/projects/modern-house-02.png";
import house3 from "../assets/projects/modern-house-03.png";
import house4 from "../assets/projects/modern-house-04.png";
import "./Home.css";

function Hero() {
  return (
    <div className="home-page">
      <section className="hero" id="home" aria-labelledby="hero-heading">
        <div className="hero-content">
          <p className="hero-label">Building with purpose</p>
          <h2 className="hero-heading" id="hero-heading">
            For thoughtful modern spaces
          </h2>

          <p className="hero-description">
            Matrabhumi designs and builds thoughtful spaces that feel like home.
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

      <section
        className="home-projects"
        aria-labelledby="featured-projects-heading"
      >
        <div className="section-heading">
          <p className="section-label">Selected work</p>
          <h2 id="featured-projects-heading">Homes shaped around real life</h2>
          <p>
            Explore a selection of residential spaces developed with clarity,
            care, and purpose.
          </p>
        </div>

        <div className="featured-projects-preview">
          <div className="featured-project-card featured-project-card--wide">
            <div className="featured-project-image">
              <img
                src={house1}
                alt="Modern residence concept preview"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>Concept preview</p>
              <h3>Modern residence study</h3>
            </div>
          </div>

          <div className="featured-project-card">
            <div className="featured-project-image">
              <img
                src={house2}
                alt="Contemporary home concept preview"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>Concept preview</p>
              <h3>Courtyard home study</h3>
            </div>
          </div>

          <div className="featured-project-card">
            <div className="featured-project-image">
              <img
                src={house3}
                alt="Garden residence concept preview"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>Concept preview</p>
              <h3>Garden residence study</h3>
            </div>
          </div>
        </div>

        <Link className="text-link" to="/projects">
          Explore all projects
        </Link>
      </section>

      <section className="home-about" aria-labelledby="home-about-heading">
        <div className="home-about-visual">
          <img
            src={house4}
            alt="Modern residence concept preview"
            width="1536"
            height="1024"
            loading="lazy"
          />
        </div>
        <div className="home-about-content">
          <div className="section-heading">
            <p className="section-label">About Matrabhumi</p>
            <h2 id="home-about-heading">Building places people belong to</h2>
          </div>
          <div className="home-about-copy">
            <p>
              Every project begins by understanding the people, place, and
              purpose behind it. From the first idea to the finished space,
              Matrabhumi keeps the process thoughtful and clear.
            </p>
            <Link className="text-link" to="/about">
              Learn about Matrabhumi
            </Link>
          </div>
        </div>
      </section>

      <section className="home-process" aria-labelledby="process-heading">
        <div className="section-heading">
          <p className="section-label">Our process</p>
          <h2 id="process-heading">From first conversation to final handover</h2>
        </div>

        <div className="process-steps">
          <div className="process-step">
            <span>01</span>
            <h3>Discover</h3>
            <p>Understand the people, site, priorities, and possibilities.</p>
          </div>
          <div className="process-step">
            <span>02</span>
            <h3>Design</h3>
            <p>Shape the ideas into a clear and considered direction.</p>
          </div>
          <div className="process-step">
            <span>03</span>
            <h3>Build</h3>
            <p>Bring the design to life with care and close coordination.</p>
          </div>
          <div className="process-step">
            <span>04</span>
            <h3>Deliver</h3>
            <p>Complete the space and prepare it for everyday living.</p>
          </div>
        </div>
      </section>

      <section className="home-cta" aria-labelledby="home-cta-heading">
        <p className="section-label">Start a conversation</p>
        <h2 id="home-cta-heading">
          Let&apos;s create a place that feels like home.
        </h2>
        <Link className="primary-button" to="/contact">
          Contact us
        </Link>
      </section>
    </div>
  );
}

export default Hero;
