import "./Projects.css";

function Projects() {
  const projects = [
    {
      title: "File Organizer",
      description:
        "A CLI tool that automatically sorts files into categorized folders. Features watch mode for real-time organizing, full undo support, and detailed logging.",
      tags: ["Python", "CLI", "Automation"],
      link: "https://github.com/alexander-dovbush/file-organizer",
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
        {projects.map((project, index) => {
          const CardWrapper = project.link ? "a" : "div";
          const cardProps = project.link
            ? { href: project.link, target: "_blank", rel: "noreferrer" }
            : {};

          return (
            <CardWrapper key={index} className="project-card" {...cardProps}>
              <div className="project-header">
                <span className="project-icon">&#x2F;&#x2F;</span>
                {project.link && <span className="project-link-icon">↗</span>}
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
            </CardWrapper>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
