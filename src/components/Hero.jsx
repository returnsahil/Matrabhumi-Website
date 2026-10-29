import { Link } from "react-router";
import { useEffect, useState } from "react";
import architectureHero from "../assets/architecture-hero.webp";
import { FiMessageCircle, FiCompass, FiCheckSquare, FiUsers } from "react-icons/fi";
import {
  defaultHomepageSettings,
  homepageSettingsChangeEvent,
} from "../content/homepageSettingsConfig.js";
import "./Home.css";
import FeaturedProjectStrip from "./FeaturedProjectStrip.jsx";

const trustIcons = [FiMessageCircle, FiCompass, FiCheckSquare, FiUsers];

function Hero({ copy, projectCopy, language }) {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [homepageSettings, setHomepageSettings] = useState(
    defaultHomepageSettings,
  );
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadFeaturedProjects() {
      try {
        const {
          getFeaturedProjects,
          getProjectCoverImage,
          getProjectImageUrl,
        } = await import("../services/projects.js");
        const { projects, error } = await getFeaturedProjects();

        if (isCurrent && !error) {
          setFeaturedProjects(
            projects.map((project) => {
              const coverImage = getProjectCoverImage(project.project_images);
              return {
                ...project,
                imageUrl: coverImage
                  ? getProjectImageUrl(coverImage.storage_path)
                  : null,
                imageAltEn: coverImage?.alt_text_en || project.title_en,
                imageAltHi:
                  coverImage?.alt_text_hi ||
                  coverImage?.alt_text_en ||
                  project.title_en,
              };
            }),
          );
        }
      } catch {
        // The page remains usable if featured work cannot be loaded.
      }
    }

    loadFeaturedProjects();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    let latestRequest = 0;

    async function loadHomepageSettings() {
      const request = ++latestRequest;
      try {
        const { getHomepageSettings, getSiteAssetUrl } = await import(
          "../services/siteSettings.js"
        );
        const { settings, error } = await getHomepageSettings();
        if (!isCurrent || request !== latestRequest) return;
        if (error) {
          setHeroImageUrl((current) => current ?? architectureHero);
          return;
        }

        setHomepageSettings(settings);
        if (!settings.hero_image_path) {
          setHeroImageUrl(architectureHero);
          return;
        }

        const imageUrl = getSiteAssetUrl(settings.hero_image_path);
        const image = new Image();
        image.src = imageUrl;
        await image.decode();
        if (isCurrent && request === latestRequest) setHeroImageUrl(imageUrl);
      } catch {
        if (isCurrent && request === latestRequest) {
          setHeroImageUrl((current) => current ?? architectureHero);
        }
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

  const homepageProjects = featuredProjects.map((project) => {
    return {
      id: project.id,
      title:
        language === "hi"
          ? project.title_hi || project.title_en
          : project.title_en,
      status: projectCopy.statuses[project.construction_status],
      imageUrl: project.imageUrl,
      imageAlt: language === "hi" ? project.imageAltHi : project.imageAltEn,
    };
  });

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
        className={`hero${heroImageUrl && heroImageUrl !== architectureHero ? " hero--custom" : ""}`}
        id="home"
        aria-labelledby="hero-heading"
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
        {heroImageUrl && (
          <img
            className="hero-image"
            src={heroImageUrl}
            alt={copy.heroAlt}
            fetchPriority="high"
            decoding="async"
            onError={() => {
              if (heroImageUrl !== architectureHero) {
                setHeroImageUrl(architectureHero);
              }
            }}
          />
        )}
      </section>

      <section
        className="home-projects"
        aria-labelledby="featured-projects-heading"
      >
        <div className="section-heading">
          <h2 id="featured-projects-heading">{copy.projectsHeading}</h2>
          <p>{copy.projectsIntro}</p>
        </div>

        <FeaturedProjectStrip projects={homepageProjects} />

        <Link className="text-link" to="/projects">
          {copy.exploreProjects}
        </Link>
      </section>

      <section className="home-about" aria-labelledby="home-about-heading">
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
        <ul className="home-trust-points">
          {copy.aboutPoints.map(([title, description], index) => {
            const Icon = trustIcons[index];
            return (
              <li className="home-trust-point" key={title}>
                <span className="home-trust-icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            );
          })}
        </ul>
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

    </div>
  );
}

export default Hero;
