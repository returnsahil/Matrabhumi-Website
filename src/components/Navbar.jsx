import { Link } from "react-router";

function Navbar() {
  return (
    <header className="navbar">
      <h1 className="brand">Matrabhumi</h1>

      <nav aria-label="Main navigation">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
