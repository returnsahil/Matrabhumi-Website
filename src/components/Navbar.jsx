import { NavLink } from "react-router";
import { useState } from "react";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="navbar">
      <h1 className="brand">Matrabhumi</h1>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰ और जानें"}
      </button>
      <nav
        className={menuOpen ? "nav-menu open" : "nav-menu"}
        aria-label="Main navigation"
      >
        <ul className="nav-links">
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={() => setMenuOpen(false)}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
