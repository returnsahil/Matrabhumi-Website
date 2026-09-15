import { NavLink } from "react-router";
import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

function Navbar({
  copy,
  brand,
  isDark,
  language,
  onThemeToggle,
  onLanguageToggle,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="navbar">
      <h1 className="brand">{brand}</h1>
      <nav
        className={menuOpen ? "nav-menu open" : "nav-menu"}
        aria-label={copy.navigation}
      >
        <ul className="nav-links">
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              {copy.home}
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              {copy.about}
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={() => setMenuOpen(false)}>
              {copy.projects}
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              {copy.contact}
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="nav-actions">
        <button
          className="utility-toggle"
          type="button"
          aria-label={isDark ? copy.lightMode : copy.darkMode}
          title={isDark ? copy.lightMode : copy.darkMode}
          aria-pressed={isDark}
          onClick={onThemeToggle}
        >
          {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
        <button
          className="utility-toggle language-toggle"
          type="button"
          aria-label={copy.languageLabel}
          title={copy.languageLabel}
          aria-pressed={language === "hi"}
          onClick={onLanguageToggle}
        >
          {copy.language}
        </button>
      </div>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
      </button>
    </header>
  );
}

export default Navbar;
