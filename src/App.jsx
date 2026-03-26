import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import CodeScreen from "./components/CodeScreen";
import CircuitPattern from "./components/CircuitPattern";
import Particles from "./components/Particles";
import ScrollReveal from "./components/ScrollReveal";

function App() {
  return (
    <div>
      <Particles />
      <CircuitPattern />
      <Navbar />
      <Hero />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <Skills />
      </ScrollReveal>
      <ScrollReveal>
        <Projects />
      </ScrollReveal>
      <Footer />
      <CodeScreen />
    </div>
  );
}

export default App;
