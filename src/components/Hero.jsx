import { Link } from "react-router";
import { useEffect, useState } from "react";
import architectureHero from "../assets/architecture-hero.webp";
import house4 from "../assets/projects/modern-house-04.webp";
import {
  getFeaturedProjects,
  getProjectCoverImage,
  getProjectImageUrl,
} from "../services/projects.js";
import {
  defaultHomepageSettings,
  getHomepageSettings,
  getSiteAssetUrl,
  homepageSettingsChangeEvent,
} from "../services/siteSettings.js";
import "./Home.css";

function Hero({ copy, projectCopy, language }) {
  const [projectCursor, setProjectCursor] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [homepageSettings, setHomepageSettings] = useState(
    defaultHomepageSettings,
  );
  const [homepageSettingsReady, setHomepageSettingsReady] = useState(false);
  const [loadedHeroImage, setLoadedHeroImage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadFeaturedProjects() {
      const { projects, error } = await getFeaturedProjects();

      if (isCurrent && !error) {
        setFeaturedProjects(projects);
      }
    }

    loadFeaturedProjects();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadHomepageSettings() {
      const { settings, error } = await getHomepageSettings();

      if (isCurrent && !error) {
        setHomepageSettings(settings);
      }

      if (isCurrent) {
        setHomepageSettingsReady(true);
      }
    }

    loadHomepageSettings();

    function refreshHomepageSettings(event) {
      if (
        event instanceof StorageEvent &&
        event.key !== homepageSettingsChangeEvent
      ) {
        return;
      }

      loadHomepageSettings();
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        loadHomepageSettings();
      }
    }

    window.addEventListener("focus", refreshHomepageSettings);
    window.addEventListener("storage", refreshHomepageSettings);
    window.addEventListener(
      homepageSettingsChangeEvent,
      refreshHomepageSettings,
    );
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      isCurrent = false;
      window.removeEventListener("focus", refreshHomepageSettings);
      window.removeEventListener("storage", refreshHomepageSettings);
      window.removeEventListener(
        homepageSettingsChangeEvent,
        refreshHomepageSettings,
      );
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const customHeroHeading =
    language === "hi"
      ? homepageSettings.hero_line_hi
      : homepageSettings.hero_line_en;
  const heroHeading = customHeroHeading || copy.heroHeading;
  const homepageHeroImage = homepageSettings.hero_image_path
    ? getSiteAssetUrl(homepageSettings.hero_image_path)
    : architectureHero;
  const heroIsReady =
    homepageSettingsReady && loadedHeroImage === homepageHeroImage;

  const homepageProjects = featuredProjects.map((project) => {
    const coverImage = getProjectCoverImage(project.project_images);

    return {
      id: project.id,
      title:
        language === "hi"
          ? project.title_hi || project.title_en
          : project.title_en,
      status: projectCopy.statuses[project.construction_status],
      imageUrl: coverImage
        ? getProjectImageUrl(coverImage.storage_path)
        : null,
      imageAlt: coverImage
        ? language === "hi"
          ? coverImage.alt_text_hi || coverImage.alt_text_en || project.title_en
          : coverImage.alt_text_en || project.title_en
        : "",
    };
  });

  const homepageProjectSlots = Array.from(
    { length: 3 },
    (_, index) => homepageProjects[index] ?? null,
  );

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

      <section
        className={`hero ${heroIsReady ? "is-ready" : "is-loading"}`}
        id="home"
        aria-labelledby="hero-heading"
        aria-busy={!heroIsReady}
      >
        <div className="hero-content">
          <p className="hero-label">{copy.heroLabel}</p>
          <h2 className="hero-heading" id="hero-heading">
            {heroHeading}
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
        <img
          className="hero-image"
          src={homepageHeroImage}
          alt={copy.heroAlt}
          onLoad={() => setLoadedHeroImage(homepageHeroImage)}
          onError={() => {
            if (homepageSettings.hero_image_path) {
              setHomepageSettings((current) => ({
                ...current,
                hero_image_path: null,
              }));
            } else {
              setLoadedHeroImage(homepageHeroImage);
            }
          }}
        />
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
          {homepageProjectSlots.map((project, index) => {
            const cardClassName = `featured-project-card${
              index === 0 ? " featured-project-card--wide" : ""
            }${project ? "" : " is-empty"}`;

            const imageArea = (
              <div className="featured-project-image">
                {project?.imageUrl ? (
                  <img src={project.imageUrl} alt={project.imageAlt} loading="lazy" />
                ) : (
                  <div className="featured-project-empty" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M4 5.5h16v13H4z" />
                      <circle cx="9" cy="10" r="1.5" />
                      <path d="m5.5 17 4.5-4 3 2.5 2.5-2 3 3.5" />
                    </svg>
                  </div>
                )}
              </div>
            );

            if (!project) {
              return (
                <div className={cardClassName} key={`empty-project-${index}`}>
                  {imageArea}
                </div>
              );
            }

            return (
              <Link
                className={cardClassName}
                to="/projects"
                aria-label={project.title}
                key={project.id}
                onPointerEnter={moveProjectCursor}
                onPointerMove={moveProjectCursor}
                onPointerLeave={hideProjectCursor}
              >
                {imageArea}
                <div className="featured-project-copy">
                  <p>{project.status}</p>
                  <h3>{project.title}</h3>
                </div>
              </Link>
            );
          })}
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
