import "./Skills.css";

function Skills() {
  const skills = [
    { name: "Java", level: "Core" },
    { name: "C#", level: "Core" },
    { name: "Python", level: "Core" },
    { name: "JavaScript", level: "Core" },
    { name: "React", level: "Frontend" },
    { name: "HTML & CSS", level: "Frontend" },
    { name: "Git", level: "Tools" },
    { name: "SQL", level: "Data" },
    { name: "FPGA", level: "Hardware" },
    { name: "Electronics", level: "Hardware" },
  ];

  return (
    <section id="skills" className="skills">
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.name} className="skill-card">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-label">{skill.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
