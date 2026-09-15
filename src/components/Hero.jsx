import { Link } from "react-router";
import { useState } from "react";
import architectureHero from "../assets/architecture-hero.png";
import house1 from "../assets/projects/modern-house-01.png";
import house2 from "../assets/projects/modern-house-02.png";
import house3 from "../assets/projects/modern-house-03.png";
import house4 from "../assets/projects/modern-house-04.png";
import "./Home.css";

function Hero({ copy }) {
  const [projectCursor, setProjectCursor] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  function moveProjectCursor(event) {
    if (event.pointerType === "touch") return;

    setProjectCursor({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function hideProjectCursor() {
    setProjectCursor((current) => ({ ...current, visible: false }));
  }

  return (
    <div className="home-page">
      <svg
        className="home-blueprint"
        viewBox="0 0 1600 1040"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="blueprint-flow blueprint-flow--top"
          pathLength="1"
          d="M-40 150 C180 150 174 34 384 34 H650"
        />
        <path
          className="blueprint-flow blueprint-flow--side"
          pathLength="1"
          d="M1640 74 C1370 70 1510 302 1322 382 C1190 438 1392 520 1530 624 C1580 662 1610 708 1640 770"
        />
        <path
          className="blueprint-flow blueprint-flow--main"
          pathLength="1"
          d="M-60 682 C168 816 308 658 522 738 C726 814 854 882 1062 760 C1270 638 1416 686 1660 774"
        />

        <g className="blueprint-dimensions">
          <path pathLength="1" d="M1160 166 H1470" />
          <path pathLength="1" d="M1160 150 V182 M1264 156 V176 M1368 156 V176 M1470 150 V182" />
        </g>

        <g className="blueprint-points">
          <circle cx="384" cy="34" r="5" />
          <circle cx="522" cy="738" r="5" />
          <circle cx="1062" cy="760" r="5" />
          <circle cx="1322" cy="382" r="5" />
        </g>
      </svg>

      <svg
        className="home-blueprint home-blueprint--middle"
        viewBox="0 0 1600 1700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="blueprint-flow blueprint-flow--middle-a"
          pathLength="1"
          d="M-120 180 C128 18 330 318 556 176 C794 26 962 196 1126 346 C1304 508 1442 444 1720 258"
        />
        <path
          className="blueprint-flow blueprint-flow--middle-b"
          pathLength="1"
          d="M-80 936 C214 734 334 1114 626 910 C832 766 954 906 1118 1072 C1282 1238 1440 1192 1690 1010"
        />
        <path
          className="blueprint-flow blueprint-flow--middle-c"
          pathLength="1"
          d="M132 1480 C390 1308 594 1600 824 1444 C1030 1304 1226 1426 1484 1586"
        />
        <g className="blueprint-dimensions blueprint-dimensions--middle">
          <path pathLength="1" d="M84 580 H402 M84 564 V596 M190 570 V590 M296 570 V590 M402 564 V596" />
          <path pathLength="1" d="M1268 720 V1020 M1252 720 H1284 M1258 820 H1278 M1258 920 H1278 M1252 1020 H1284" />
        </g>
      </svg>

      <section className="hero" id="home" aria-labelledby="hero-heading">
        <div className="hero-content">
          <p className="hero-label">{copy.heroLabel}</p>
          <h2 className="hero-heading" id="hero-heading">
            {copy.heroHeading}
          </h2>

          <p className="hero-description">{copy.heroDescription}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/projects">
              {copy.viewProjects}
            </Link>
            <Link className="secondary-button" to="/contact">
              {copy.contactUs}
            </Link>
          </div>
        </div>
        <img className="hero-image" src={architectureHero} alt={copy.heroAlt} />
      </section>

      <section
        className="home-projects"
        aria-labelledby="featured-projects-heading"
      >
        <div className="section-heading">
          <p className="section-label">{copy.selectedWork}</p>
          <h2 id="featured-projects-heading">{copy.projectsHeading}</h2>
          <p>{copy.projectsIntro}</p>
        </div>

        <div className="featured-projects-preview">
          <Link
            className="featured-project-card featured-project-card--wide"
            to="/projects"
            aria-label={copy.projectNames[0]}
            onPointerEnter={moveProjectCursor}
            onPointerMove={moveProjectCursor}
            onPointerLeave={hideProjectCursor}
          >
            <div className="featured-project-image">
              <img
                src={house1}
                alt={copy.projectAlts[0]}
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>{copy.conceptPreview}</p>
              <h3>{copy.projectNames[0]}</h3>
            </div>
          </Link>

          <Link
            className="featured-project-card"
            to="/projects"
            aria-label={copy.projectNames[1]}
            onPointerEnter={moveProjectCursor}
            onPointerMove={moveProjectCursor}
            onPointerLeave={hideProjectCursor}
          >
            <div className="featured-project-image">
              <img
                src={house2}
                alt={copy.projectAlts[1]}
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>{copy.conceptPreview}</p>
              <h3>{copy.projectNames[1]}</h3>
            </div>
          </Link>

          <Link
            className="featured-project-card"
            to="/projects"
            aria-label={copy.projectNames[2]}
            onPointerEnter={moveProjectCursor}
            onPointerMove={moveProjectCursor}
            onPointerLeave={hideProjectCursor}
          >
            <div className="featured-project-image">
              <img
                src={house3}
                alt={copy.projectAlts[2]}
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
            <div className="featured-project-copy">
              <p>{copy.conceptPreview}</p>
              <h3>{copy.projectNames[2]}</h3>
            </div>
          </Link>
        </div>

        <Link className="text-link" to="/projects">
          {copy.exploreProjects}
        </Link>
      </section>

      <section className="home-about" aria-labelledby="home-about-heading">
        <div className="home-about-visual">
          <img
            src={house4}
            alt={copy.projectAlts[0]}
            width="1536"
            height="1024"
            loading="lazy"
          />
        </div>
        <div className="home-about-content">
          <div className="section-heading">
            <p className="section-label">{copy.aboutLabel}</p>
            <h2 id="home-about-heading">{copy.aboutHeading}</h2>
          </div>
          <div className="home-about-copy">
            <p>{copy.aboutCopy}</p>
            <Link className="text-link" to="/about">
              {copy.aboutLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-process" aria-labelledby="process-heading">
        <div className="section-heading">
          <p className="section-label">{copy.processLabel}</p>
          <h2 id="process-heading">{copy.processHeading}</h2>
        </div>

        <div className="process-steps">
          {copy.steps.map(([title, description], index) => (
            <div className="process-step" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta" aria-labelledby="home-cta-heading">
        <p className="section-label">{copy.ctaLabel}</p>
        <h2 id="home-cta-heading">{copy.ctaHeading}</h2>
        <Link className="primary-button" to="/contact">
          {copy.contactUs}
        </Link>
      </section>

      <div
        className={`project-cursor${projectCursor.visible ? " is-visible" : ""}`}
        style={{ left: projectCursor.x, top: projectCursor.y }}
        aria-hidden="true"
      >
        {copy.projectCursor}
      </div>
    </div>
  );
}

export default Hero;
