import house1 from "../assets/projects/modern-house-01.png";
import house2 from "../assets/projects/modern-house-02.png";
import house3 from "../assets/projects/modern-house-03.png";
import house4 from "../assets/projects/modern-house-04.png";
import house5 from "../assets/projects/modern-house-05.png";
import { ProjectCard } from "./ProjectCard";
import "./Projects.css";
// create a array of the projects that need to be accesed multiple times in the page this is one array that could be accesed multipletimes
const projectImages = [house1, house2, house3, house4, house5];

function Projects({ copy }) {
  const projects = projectImages.map((image, index) => ({
    id: index + 1,
    title: copy.title,
    description: copy.description,
    label: copy.preview,
    image,
  }));

  return (
    <section id="projects">
      <header className="projects-header">
        <p className="projects-label">{copy.label}</p>
        <h1>{copy.heading}</h1>
        <p className="projects-intro">{copy.intro}</p>
      </header>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
