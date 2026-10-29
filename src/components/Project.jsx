import { useEffect, useState } from "react";
import ProjectJournal from "./ProjectJournal.jsx";
import {
  getProjectCoverImage,
  getProjectImageUrl,
  getPublishedProjects,
  orderProjectImages,
} from "../services/projects.js";
import "./Projects.css";

function Projects({ copy, language }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadProjects() {
      try {
        const { projects: publishedProjects, error } =
          await getPublishedProjects();

        if (!isCurrent) return;

        if (error) {
          setLoadError(copy.loadError);
        } else {
          setProjects(publishedProjects);
          setLoadError("");
        }
      } catch {
        if (isCurrent) setLoadError(copy.loadError);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadProjects();

    return () => {
      isCurrent = false;
    };
  }, [copy.loadError]);

  const visibleProjects = projects.map((project, index) => {
    const coverImage = getProjectCoverImage(project.project_images);

    return {
      ...project,
      number: index + 1,
      title:
        language === "hi"
          ? project.title_hi || project.title_en
          : project.title_en,
      description:
        language === "hi"
          ? project.description_hi || project.description_en
          : project.description_en,
      location:
        language === "hi"
          ? project.location_hi || project.location_en
          : project.location_en,
      statusLabel: copy.statuses[project.construction_status],
      coverImageId: coverImage?.id ?? null,
      images: orderProjectImages(project.project_images).map((image) => ({
        ...image,
        url: getProjectImageUrl(image.storage_path),
        alt:
          language === "hi"
            ? image.alt_text_hi || image.alt_text_en || project.title_en
            : image.alt_text_en || project.title_en,
      })),
    };
  });
  const renderableProjects = visibleProjects.filter((project) => project.images.length > 0);

  return (
    <section id="projects">
      <header className="projects-header">
        <div className="projects-header-inner">
          <p className="projects-label">{copy.label}</p>
          <h1>{copy.heading}</h1>
          <p className="projects-intro">{copy.intro}</p>
        </div>
        {!isLoading && !loadError && renderableProjects.length > 0 && (
          <a className="projects-scroll-cue" href="#projects-showcase">
            {copy.scrollCue}<span aria-hidden="true">↓</span>
          </a>
        )}
      </header>

      {isLoading && (
        <div className="projects-loading-showcase" role="status">
          <span>{copy.loading}</span>
        </div>
      )}

      {loadError && (
        <p className="projects-message projects-message--error" role="alert">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && renderableProjects.length === 0 && (
        <p className="projects-message">{copy.empty}</p>
      )}

      {renderableProjects.length > 0 && (
        <ProjectJournal projects={renderableProjects} copy={copy} />
      )}
    </section>
  );
}

export default Projects;
