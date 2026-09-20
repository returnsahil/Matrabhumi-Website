import { Link } from "react-router";
import "./NotFound.css";

function NotFound({ copy }) {
  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <img
        className="not-found-logo"
        src="/brand/Matrabhumi-logo-web.png"
        alt=""
        width="48"
        height="48"
        aria-hidden="true"
      />
      <h1 id="not-found-heading">{copy.heading}</h1>
      <Link className="not-found-home" to="/">
        {copy.returnHome}
      </Link>
    </section>
  );
}

export default NotFound;
