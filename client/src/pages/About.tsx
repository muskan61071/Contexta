import { Database, MessageCircle, Server, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page-container">
      <div className="page-header-standard">
        <div className="page-eyebrow"><span className="eyebrow-line" /> ABOUT THIS PROJECT</div>
        <h1>About Contexta</h1>
        <p>A small local tool for spotting unclear words before you send a message.</p>
      </div>

      <section className="about-section-card">
        <div className="section-head"><h2>What it does</h2></div>
        <p className="about-body-text">
          Contexta checks a message against earlier conversation text. It can point out references such as “it”, “her”, or “that”, offer a possible meaning, and suggest a clarification question or clearer wording.
        </p>
        <p className="about-body-text">
          The analysis uses simple text rules, not a large AI model. It may miss things or make a poor suggestion, so always check the result yourself.
        </p>
      </section>

      <section className="about-section-card">
        <div className="section-head"><h2>What the project parts do</h2></div>
        <div className="tech-stack-grid">
          <div className="tech-item-card"><MessageCircle size={20}/><h4>Website</h4><p>Where you enter context and messages and read the results.</p></div>
          <div className="tech-item-card"><Server size={20}/><h4>API</h4><p>Connects the website to the analysis service.</p></div>
          <div className="tech-item-card"><Sparkles size={20}/><h4>Analysis</h4><p>Applies the project's text rules to find possible unclear references.</p></div>
          <div className="tech-item-card"><Database size={20}/><h4>History</h4><p>Keeps analyses you save on this computer.</p></div>
        </div>
      </section>
    </div>
  );
}
