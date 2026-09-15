import "./About.css";

function About({ copy, language }) {
  return (
    <div className="about-page" id="about">
      <section
        className="about-intro"
        lang={language}
        aria-labelledby="about-heading"
      >
        <p className="about-label">{copy.label}</p>
        <h1 id="about-heading">{copy.heading}</h1>
        <div className="about-intro-side">
          <p className="about-intro-copy">{copy.intro}</p>
        </div>
      </section>

      <section
        className="about-story"
        lang={language}
        aria-labelledby="about-story-heading"
      >
        <div className="about-story-heading">
          <p className="about-label">{copy.storyLabel}</p>
          <h2 id="about-story-heading">{copy.storyHeading}</h2>
        </div>

        <div className="about-chapters">
          {copy.chapters.map((chapter, index) => (
            <div className="about-chapter" key={chapter.title}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{chapter.title}</h3>
              {chapter.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
