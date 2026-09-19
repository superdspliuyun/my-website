import ContactSection from './components/ContactSection'
import Hero from './components/Hero'
import Navigation from './components/Navigation'
import ProjectsSection from './components/ProjectsSection'
import AboutSection from './components/AboutSection'

function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  )
}

export default App
