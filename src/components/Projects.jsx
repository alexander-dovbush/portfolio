import "./Projects.css";

function Projects() {
  const projects = [
    {
      title: "Coming Soon",
      description: "My first project is in the works. Stay tuned.",
      tags: ["React", "JavaScript"],
      link: null,
    },
    {
      title: "Coming Soon",
      description: "Something interesting is brewing. Check back later.",
      tags: ["Java", "SQL"],
      link: null,
    },
    {
      title: "Coming Soon",
      description: "More projects on the way as I keep building.",
      tags: ["Python"],
      link: null,
    },
  ];

  return (
    <section id="projects" className="projects">
      <h2 className="section-title">Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-header">
              <span className="project-icon">&#x2F;&#x2F;</span>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">
                  ↗
                </a>
              )}
            </div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
