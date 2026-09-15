import "./App.css";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./components/About.jsx";
import { Routes, Route, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Contact from "./components/Contact.jsx";
import Projects from "./components/Project.jsx";
import { siteCopy } from "./content/siteCopy.js";

function App() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("matrabhumi-theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [language, setLanguage] = useState(
    () => localStorage.getItem("matrabhumi-language") || "en",
  );
  const copy = siteCopy[language];

  useEffect(() => {
    document.title = copy.pageTitles[location.pathname] || copy.brand;
  }, [copy, location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("matrabhumi-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("matrabhumi-language", language);
  }, [language]);

  return (
    <div className="site-wrapper">
      <Navbar
        copy={copy.nav}
        brand={copy.brand}
        isDark={isDark}
        language={language}
        onThemeToggle={() => setIsDark((current) => !current)}
        onLanguageToggle={() =>
          setLanguage((current) => (current === "en" ? "hi" : "en"))
        }
      />
      <main>
        <Routes>
          <Route path="/" element={<Hero copy={copy.home} />} />
          <Route
            path="/about"
            element={<About copy={copy.about} language={language} />}
          />
          <Route path="/contact" element={<Contact copy={copy.contact} />} />
          <Route
            path="/projects"
            element={<Projects copy={copy.projects} />}
          />
        </Routes>
      </main>
      <Footer copy={copy.footer} navCopy={copy.nav} brand={copy.brand} />
    </div>
  );
}

export default App;
