import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <>
      {/* Nav 为 fixed 定位（Navigation.tsx:35），始终贴顶；DOM 顺序仍是首位 */}
      <Navigation />
      <Hero />
      <Projects />
      <Contact />
    </>
  );
}

export default App;