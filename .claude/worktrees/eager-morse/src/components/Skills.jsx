import "./Skills.css";

function Skills() {
  const softSkills = [
    "Team Player",
    "Fast Learner",
    "Problem Solver",
    "Self-Motivated",
    "Adaptable",
    "Detail-Oriented",
  ];

  const languages = [
    "Java",
    "C#",
    "Python",
    "JavaScript",
    "React",
    "HTML & CSS",
  ];

  const databases = ["MySQL", "MongoDB"];

  const hardware = ["FPGA", "Electronics"];

  const networking = [
    "CCNA",
    "TCP/IP",
    "DNS",
    "DHCP",
    "VLANs",
    "Routing & Switching",
  ];

  const tools = ["PyCharm", "VS Code", "Visual Studio", "Eclipse", "Git"];

  return (
    <section id="skills" className="skills">
      <h2 className="section-title">Skills</h2>
      <div className="skills-soft">
        {softSkills.map((skill) => (
          <span key={skill} className="soft-tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="tech-sections">
        <div className="tech-group">
          <h3 className="tech-group-title">Languages & Frameworks</h3>
          <div className="tech-tags">
            {languages.map((lang) => (
              <span key={lang} className="tech-tag">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="tech-group">
          <h3 className="tech-group-title">Databases</h3>
          <div className="tech-tags">
            {databases.map((db) => (
              <span key={db} className="tech-tag">
                {db}
              </span>
            ))}
          </div>
        </div>

        <div className="tech-group">
          <h3 className="tech-group-title">Networking</h3>
          <div className="tech-tags">
            {networking.map((net) => (
              <span key={net} className="tech-tag">
                {net}
              </span>
            ))}
          </div>
        </div>

        <div className="tech-group">
          <h3 className="tech-group-title">Development Tools</h3>
          <div className="tech-tags">
            {tools.map((tool) => (
              <span key={tool} className="tech-tag">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
