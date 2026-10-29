import "./About.css";
import { Link } from "react-router";

function About({ copy, language }) {
  return (
    <div className="about-page" id="about">
      <header className="about-hero" lang={language}>
        <div className="about-hero-copy">
          <p className="about-hero-eyebrow">{copy.heroEyebrow}</p>
          <h1 id="about-heading">
            {copy.heroHeading.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="about-hero-support">{copy.heroSupport}</p>
        </div>
        <figure className="about-illustration">
          <img
            src="/about-father-son-line.webp"
            alt={copy.imageAlt}
            width="2172"
            height="724"
            decoding="async"
          />
        </figure>
        <a className="about-discover" href="#about-story">
          {copy.discoverStory}<span aria-hidden="true">↓</span>
        </a>
      </header>
      <section className="about-story" id="about-story" lang={language} aria-labelledby="about-story-heading">
        <p className="about-label">{copy.label}</p>
        <h2 id="about-story-heading">{copy.heading}</h2>
        <p className="about-story-intro">{copy.intro}</p>
        <div className="about-story-body">
          <p>{copy.chapters.flatMap((chapter) => chapter.paragraphs).join(" ")}</p>
          <Link className="about-story-link" to="/contact">{copy.learnMore}</Link>
        </div>
      </section>
    </div>
  );
}

export default About;
