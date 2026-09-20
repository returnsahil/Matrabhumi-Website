import "./App.css";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, useLocation } from "react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { siteCopy } from "./content/siteCopy.js";
import NotFound from "./components/NotFound.jsx";
import Seo from "./components/Seo.jsx";

const About = lazy(() => import("./components/About.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const Projects = lazy(() => import("./components/Project.jsx"));
const AdminPage = lazy(() => import("./components/Admin/Admin.jsx"));

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
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("matrabhumi-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("matrabhumi-language", language);
  }, [language]);

  return (
    <div className="site-wrapper">
      <Seo copy={copy} language={language} pathname={location.pathname} />
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
        <Suspense
          fallback={
            <p
              className={`route-loading${isAdminRoute ? " is-admin" : ""}`}
              role="status"
            >
              Loading…
            </p>
          }
        >
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
        </Suspense>
      </main>
      {showSiteChrome && (
        <Footer copy={copy.footer} navCopy={copy.nav} brand={copy.brand} />
      )}
    </div>
  );
}

export default App;
