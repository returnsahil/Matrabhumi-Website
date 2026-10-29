import { Link } from "react-router";

export default function FeaturedProjectStrip({ projects }) {
  const moving = projects.length > 1;

  function renderCards(duplicate = false) {
    return projects.map((project) => (
      <Link
        className="featured-project-card"
        to="/projects"
        aria-label={project.title}
        tabIndex={duplicate ? -1 : undefined}
        key={project.id}
      >
        <div className="featured-project-image">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={duplicate ? "" : project.imageAlt}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          ) : (
            <div className="featured-project-empty" aria-hidden="true" />
          )}
        </div>
        <div className="featured-project-copy">
          <p>{project.status}</p>
          <h3>{project.title}</h3>
        </div>
      </Link>
    ));
  }

  if (!projects.length) return null;

  return (
    <div
      className={`featured-projects-preview project-strip${moving ? " project-strip--moving" : ""}`}
      style={{ "--strip-duration": `${projects.length * 18}s` }}
    >
      <div className="project-strip-viewport">
        <div className="project-strip-track">
          <div className="project-strip-group">{renderCards()}</div>
          {moving && [1, 2].map((copy) => (
            <div className="project-strip-group project-strip-duplicate" aria-hidden="true" key={copy}>
              {renderCards(true)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
