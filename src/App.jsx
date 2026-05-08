import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Particles from "./components/effects/Particles";
import CircuitPattern from "./components/effects/CircuitPattern";
import CodeScreen from "./components/effects/CodeScreen";
import ConstellationClock from "./components/effects/ConstellationClock";
import ZodiacConstellation from "./components/effects/ZodiacConstellation";
import TimeConstellation from "./components/effects/TimeConstellation";
import ScrollReveal from "./components/ui/ScrollReveal";
import BackToTop from "./components/ui/BackToTop";

function App() {
  return (
    <div>
      <Particles />
      <ZodiacConstellation />
      <TimeConstellation />
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
      <BackToTop />
      <CodeScreen />
      <ConstellationClock />
    </div>
  );
}

export default App;
