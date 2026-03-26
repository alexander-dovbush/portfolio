import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">Alexander Dovbush</h1>
        <p className="hero-title">Software Engineering Student</p>
        <p className="hero-subtitle">
          Technion · Java · C# · Python · JavaScript · React
        </p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">
            View My Work
          </a>
          <a href="#about" className="btn btn-outline">
            About Me
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
