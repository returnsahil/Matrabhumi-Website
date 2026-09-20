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
import AdminPage from "./components/Admin/Admin.jsx";
import NotFound from "./components/NotFound.jsx";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isKnownPublicRoute = ["/", "/about", "/projects", "/contact"].includes(
    normalizedPath,
  );
  const showSiteChrome = !isAdminRoute && isKnownPublicRoute;
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
    document.title =
      copy.pageTitles[location.pathname] ||
      (isAdminRoute ? `Admin | ${copy.brand}` : copy.pageTitles.notFound);
  }, [copy, isAdminRoute, location.pathname]);

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
      {showSiteChrome && (
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
      )}
      <main className={isAdminRoute ? "admin-main" : undefined}>
        <Routes>
          <Route
            path="/"
            element={
              <Hero
                copy={copy.home}
                projectCopy={copy.projects}
                language={language}
              />
            }
          />
          <Route
            path="/about"
            element={<About copy={copy.about} language={language} />}
          />
          <Route path="/contact" element={<Contact copy={copy.contact} />} />
          <Route
            path="/projects"
            element={<Projects copy={copy.projects} language={language} />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound copy={copy.notFound} />} />
        </Routes>
      </main>
      {showSiteChrome && (
        <Footer copy={copy.footer} navCopy={copy.nav} brand={copy.brand} />
      )}
    </div>
  );
}

export default App;
