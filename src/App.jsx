import "./App.css";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./components/About.jsx";
import { Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import Contact from "./components/Contact.jsx";
import Projects from "./components/Project.jsx";
function App() {
  const location = useLocation();
  useEffect(() => {
    const pageTitles = {
      "/": "Matrabhumi",
      "/about": " About | Matrabhumi ",
      "/projects": "Projects | Matrabhumi",
      "/contact": "Contact | Matrabhumi",
    };
    document.title = pageTitles[location.pathname];
  }, [location.pathname]);

  return (
    <div className="site-wrapper">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
