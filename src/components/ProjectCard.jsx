import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ProjectCard({ project }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartX = useRef(null);

  const shiftImage = useCallback(
    (direction) => {
      setActiveImageIndex(
        (current) =>
          (current + direction + project.images.length) %
          project.images.length,
      );
    },
    [project.images.length],
  );

  function openGallery() {
    setActiveImageIndex(0);
    setIsGalleryOpen(true);
  }

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }, []);

  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50 || project.images.length < 2) return;

    if (distance < 0) {
      shiftImage(1);
    } else {
      shiftImage(-1);
    }
  }

  useEffect(() => {
    if (!isGalleryOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") shiftImage(-1);
      if (event.key === "ArrowRight") shiftImage(1);
    }

    document.documentElement.classList.add("project-lightbox-open");
    document.body.classList.add("project-lightbox-open");
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.documentElement.classList.remove("project-lightbox-open");
      document.body.classList.remove("project-lightbox-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGallery, isGalleryOpen, shiftImage]);

  if (project.images.length === 0) return null;

  const coverImage = project.images[0];

  const gallery = isGalleryOpen
    ? createPortal(
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-lightbox-title-${project.id}`}
          data-lenis-prevent
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div className="project-lightbox-header">
            <div>
              <p>{project.statusLabel}</p>
              <h2 id={`project-lightbox-title-${project.id}`}>
                {project.title}
              </h2>
            </div>
            <div className="project-lightbox-status">
              <span aria-live="polite">
                {activeImageIndex + 1} / {project.images.length}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeGallery}
                aria-label={`Close ${project.title} gallery`}
              >
                ×
              </button>
            </div>
          </div>

          <div
            className="project-lightbox-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={project.images[activeImageIndex].url}
              alt={project.images[activeImageIndex].alt}
              draggable="false"
            />

            {project.images.length > 1 && (
              <>
                <button
                  className="project-lightbox-arrow project-lightbox-arrow--previous"
                  type="button"
                  onClick={() => shiftImage(-1)}
                  aria-label={`Previous image of ${project.title}`}
                >
                  ←
                </button>
                <button
                  className="project-lightbox-arrow project-lightbox-arrow--next"
                  type="button"
                  onClick={() => shiftImage(1)}
                  aria-label={`Next image of ${project.title}`}
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="project-lightbox-footer">
            <span>{project.location}</span>
            <span>{project.completion_year}</span>
            {project.images.length > 1 && <p>Swipe or use arrow keys</p>}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="project-card">
        <button
          className="project-card-cover"
          ref={openButtonRef}
          type="button"
          onClick={openGallery}
          aria-label={`Open ${project.title} image gallery`}
        >
          <img
            src={coverImage.url}
            alt={coverImage.alt}
            loading={project.number === 1 ? "eager" : "lazy"}
            decoding="async"
            draggable="false"
          />
        </button>

        <div className="project-info">
          <p className="project-meta">
            {String(project.number).padStart(2, "0")} / {project.statusLabel}
          </p>
          <h2>{project.title}</h2>
          {project.description && <p>{project.description}</p>}
          {(project.location || project.completion_year) && (
            <p className="project-details">
              {project.location && <span>{project.location}</span>}
              {project.location && project.completion_year && (
                <span aria-hidden="true">•</span>
              )}
              {project.completion_year && (
                <span>{project.completion_year}</span>
              )}
            </p>
          )}
        </div>

        <span className="project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      {gallery}
    </>
  );
}

export default ProjectCard;
