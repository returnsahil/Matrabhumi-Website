export function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <img
        src={project.image}
        alt={project.title}
        loading={project.id === 1 ? "eager" : "lazy"}
        decoding="async"
      />
      <div className="project-info">
        <p className="project-meta">
          {String(project.id).padStart(2, "0")} / {project.label}
        </p>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
      </div>
      <span className="project-arrow" aria-hidden="true">
        →
      </span>
    </div>
  );
}

export default ProjectCard;
