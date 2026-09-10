import "./About.css";

function About() {
  return (
    <div className="about-page" id="about">
      <section
        className="about-intro"
        lang="hi"
        aria-labelledby="about-heading"
      >
        <p className="about-label">हमारी कहानी</p>
        <h1 id="about-heading">ईमानदारी की नींव पर बना एक सपना</h1>
        <div className="about-intro-side">
          <p className="about-intro-copy">
            एक अपने घर का सपना, निर्माण के दौरान महसूस हुई एक कमी, और उस
            अनुभव से बेहतर करने का लिया गया एक संकल्प—यहीं से मातृभूमि की
            शुरुआत हुई।
          </p>
          <a className="about-language-link" href="#about-english" lang="en">
            Read the story in English <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section
        className="about-story"
        lang="hi"
        aria-labelledby="about-story-heading"
      >
        <div className="about-story-heading">
          <p className="about-label">शुरुआत</p>
          <h2 id="about-story-heading">एक घर से शुरू हुई नई राह</h2>
        </div>

        <div className="about-chapters">
          <div className="about-chapter">
            <span aria-hidden="true">01</span>
            <h3>अपने घर का सपना</h3>
            <p>
              भारतीय सेना से सेवानिवृत्त होने के बाद श्री कैलाश लोबानिया ने
              अपने घर का सपना पूरा करने की शुरुआत की। घर बनकर तैयार हुआ, लेकिन
              इस सफर ने उन्हें बिल्डर और ग्राहक के बीच ईमानदारी और स्पष्ट बातचीत
              की कमी का एहसास कराया।
            </p>
            <p>
              उन्हें लगा कि घर बनाने का अनुभव बेहतर हो सकता है—और होना चाहिए।
              इसी विश्वास ने उन्हें स्वयं गुणवत्ता और भरोसे के साथ निर्माण करने
              की प्रेरणा दी।
            </p>
          </div>

          <div className="about-chapter">
            <span aria-hidden="true">02</span>
            <h3>पिता और पुत्र की शुरुआत</h3>
            <p>
              श्री कैलाश लोबानिया और उनके पुत्र ध्रुव लोबानिया ने बिना किसी
              विरासत में मिले निर्माण व्यवसाय के, बिल्कुल शुरुआत से यह काम
              सीखा। हर परियोजना उनके लिए बेहतर समझ, बेहतर कारीगरी और बेहतर
              प्रक्रिया विकसित करने का अवसर बनी।
            </p>
            <p>
              उनके शुरुआती घरों की गुणवत्ता को लोगों ने सराहा। यही पहचान धीरे-
              धीरे एक भरोसेमंद व्यवसाय और मातृभूमि की मजबूत नींव बनी।
            </p>
          </div>

          <div className="about-chapter">
            <span aria-hidden="true">03</span>
            <h3>आज भी वही सीधा रिश्ता</h3>
            <p>
              मातृभूमि में ग्राहक सीधे उन लोगों से बात करते हैं जो उनके घर की
              जिम्मेदारी संभाल रहे हैं। निर्माण के हर चरण में यह व्यक्तिगत संवाद
              भरोसे और पारदर्शिता को बनाए रखता है।
            </p>
            <p>
              आज संतुष्ट ग्राहकों और निर्माणाधीन कई परियोजनाओं के साथ, यह पिता-
              पुत्र की टीम उसी सोच पर आगे बढ़ रही है जिससे सब शुरू हुआ था—हर घर
              को ईमानदारी, गुणवत्ता और सम्मान के साथ बनाना।
            </p>
          </div>
        </div>
      </section>

      <section
        className="about-english"
        id="about-english"
        lang="en"
        aria-labelledby="about-english-heading"
      >
        <div className="about-english-heading">
          <p className="about-label">Our story · English</p>
          <h2 id="about-english-heading">Built from a promise of honesty</h2>
        </div>

        <div className="about-english-copy">
          <p>
            After retiring from the Indian Army, Mr. Kailash Lobaniya set out
            to fulfil a long-held dream: building a home of his own. The home
            was completed, but the experience showed him how easily honesty and
            clear communication could be lost between a builder and a customer.
          </p>
          <p>
            He believed the process could be better. Together with his son,
            Dhruv Lobaniya, he started from the ground up. With no inherited
            construction business behind them, they learned through every
            project and worked to improve their craft, understanding, and
            process.
          </p>
          <p>
            Their first homes earned recognition from the people who experienced
            their work. What began as a personal promise gradually grew into
            Matrabhumi.
          </p>
          <p>
            Clients remain in direct contact with the people responsible for
            building their home throughout construction. Today, with happy
            homeowners and multiple sites in progress, the father-son team
            continues to build around the values that started it all: honesty,
            quality, accessibility, and respect for every customer&apos;s dream.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
