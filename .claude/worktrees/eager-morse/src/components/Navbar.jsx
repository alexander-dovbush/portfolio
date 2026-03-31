import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#hero" className="navbar-logo">
        AD
      </a>
      <ul className="navbar-links">
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#skills">Skills</a>
        </li>
        <li>
          <a href="#projects">Projects</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
