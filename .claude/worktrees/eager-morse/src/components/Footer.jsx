import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-name">Alexander Dovbush</p>
        <div className="footer-links">
          <a
            href="https://linkedin.com/in/alexander-dovbush"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <span className="footer-dot">·</span>
          <a
            href="https://github.com/alexander-dovbush"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <p className="footer-copy">Built with React · 2026</p>
      </div>
    </footer>
  );
}

export default Footer;
