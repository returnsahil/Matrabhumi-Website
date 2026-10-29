import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "./ProjectCard.jsx";

const projectQuotes = [
  "You’ve pictured it a thousand times. Let’s build it once, beautifully.",
  "Big dreams. Solid foundations. Room for everything that matters.",
  "For the day you stop saying “someday” and start saying “our home.”",
  "A little less “what if.” A little more “welcome home.”",
  "Built for muddy shoes, Sunday naps, and a lifetime of stories.",
  "Your dream deserves more than a place on a Pinterest board.",
  "Some dreams need wings. Yours might need a front door.",
  "From “imagine living here” to “come on in.”",
  "We take your plans personally. You’re going to live in them.",
  "Room to grow. Corners to call your own. A place to exhale.",
  "The best part of building a home? The life that moves in.",
  "You bring the someday. We’ll bring the bricks.",
];

export default function ProjectJournal({ projects, copy }) {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(() => new Set());

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const chapters = [...list.querySelectorAll(".projects-chapter")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const newlyVisible = entries.filter((entry) => entry.isIntersecting);
        if (!newlyVisible.length) return;
        setRevealed((current) => {
          const next = new Set(current);
          newlyVisible.forEach((entry) => next.add(Number(entry.target.dataset.index)));
          return next;
        });
        newlyVisible.forEach((entry) => observer.unobserve(entry.target));
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      chapters.forEach((chapter) => observer.observe(chapter));
      const chapterList = list.querySelector(".projects-chapters");
      chapterList?.classList.add("is-motion-ready");
      return () => {
        observer.disconnect();
        chapterList?.classList.remove("is-motion-ready");
      };
    }
    return undefined;
  }, [projects]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    let frame = null;
    const update = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const chapters = [...list.querySelectorAll(".projects-chapter")];
        const focusLine = window.innerHeight * 0.42;
        let nearest = 0;
        let distance = Infinity;
        chapters.forEach((chapter, index) => {
          const rect = chapter.getBoundingClientRect();
          const gap = Math.abs(rect.top + Math.min(rect.height, window.innerHeight) / 2 - focusLine);
          if (gap < distance) { distance = gap; nearest = index; }
        });
        setActiveIndex(nearest);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [projects]);

  return (
    <div className="projects-journal" id="projects-showcase" ref={listRef}>
      <nav className="projects-rail" aria-label={copy.projectNavigation}>
        <p className="projects-rail-counter" aria-live="off">
          {String(activeIndex + 1).padStart(2, "0")} <span>/</span> {String(projects.length).padStart(2, "0")}
        </p>
        <div className="projects-rail-markers" style={{ "--active-project": activeIndex, "--project-count": projects.length }}>
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={`#project-${project.id}`}
              className={`projects-rail-marker${index === activeIndex ? " is-active" : ""}`}
              aria-label={`${copy.projectMarker} ${index + 1}: ${project.title}`}
              aria-current={index === activeIndex ? "location" : undefined}
            ><span /></a>
          ))}
        </div>
      </nav>
      <div className="projects-chapters">
        {projects.map((project, index) => (
          <div
            className={`projects-chapter${revealed.has(index) ? " is-revealed" : ""}`}
            id={`project-${project.id}`}
            data-index={index}
            key={project.id}
          >
            <ProjectCard
              project={project}
              quote={projectQuotes[index % projectQuotes.length]}
              exploreLabel={project.project_type === "nonresidential" ? copy.viewProject : copy.exploreHome}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
