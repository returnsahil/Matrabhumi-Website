import house1 from "../assets/projects/modern-house-01.png";
import house2 from "../assets/projects/modern-house-02.png";
import house3 from "../assets/projects/modern-house-03.png";
import house4 from "../assets/projects/modern-house-04.png";
import house5 from "../assets/projects/modern-house-05.png";
import { ProjectCard } from "./ProjectCard";
import "./Projects.css";
// create a array of the projects that need to be accesed multiple times in the page this is one array that could be accesed multipletimes
const projects = [
  {
    id: 1,
    title: "Modern Residence",
    description: "A modern family home",
    image: house1,
  },
  {
    id: 2,
    title: "Modern Residence",
    description: "A modern family home",
    image: house2,
  },
  {
    id: 3,
    title: "Modern Residence",
    description: "A modern family home",
    image: house3,
  },
  {
    id: 4,
    title: "Modern Residence",
    description: "A modern family home",
    image: house4,
  },
  {
    id: 5,
    title: "Modern Residence",
    description: "A modern family home",
    image: house5,
  },
];

function Projects() {
  return (
    <section id="projects">
      <header>
        <p>Selected Work</p>
        <h1>Our Projects</h1>
        <p>Explore some of the spaces designed and created by Matrabhumi.</p>
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
