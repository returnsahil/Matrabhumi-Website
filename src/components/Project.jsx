import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import {
  getProjectCoverImage,
  getProjectImageUrl,
  getPublishedProjects,
  orderProjectImages,
} from "../services/projects.js";
import "./Projects.css";

function preloadImage(imageUrl) {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve();
      return;
    }

    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = imageUrl;
  });
}

function Projects({ copy, language }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadProjects() {
      const { projects: publishedProjects, error } =
        await getPublishedProjects();

      if (!isCurrent) return;

      if (error) {
        setLoadError(copy.loadError);
      } else {
        const coverImageUrls = publishedProjects
          .map((project) => getProjectCoverImage(project.project_images))
          .filter(Boolean)
          .map((image) => getProjectImageUrl(image.storage_path));

        await Promise.all(coverImageUrls.map(preloadImage));

        if (!isCurrent) return;
        setProjects(publishedProjects);
      }

      setIsLoading(false);
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

  return (
    <section id="projects">
      <header className="projects-header">
        <p className="projects-label">{copy.label}</p>
        <h1>{copy.heading}</h1>
        <p className="projects-intro">{copy.intro}</p>
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

      {!isLoading && !loadError && visibleProjects.length === 0 && (
        <p className="projects-message">{copy.empty}</p>
      )}

      <div className="projects-grid">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
