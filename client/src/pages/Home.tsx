import { ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  onAnalyze: () => void;
}

export default function Home({ onAnalyze }: Props) {
  return (
    <div className="home-page-container">
      <section className="home-hero-card">
        <div className="hero-eyebrow">
          <span className="eyebrow-line" /> COMMUNICATION INTELLIGENCE
        </div>
        <h1 className="hero-title">
          Make your conversations <em>clear and unambiguous.</em>
        </h1>
        <p className="hero-description">
          Paste your complete chat or conversation. Contexta automatically structures individual messages into chat bubbles, analyzes unclear references, extracts contextual evidence, and calculates miscommunication risks.
        </p>
        <div className="hero-cta-group">
          <button className="hero-btn-primary" onClick={onAnalyze}>
            <MessageSquare size={17} />
            <span>Open Conversation Analyzer</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="home-pillars-section">
        <div className="section-head">
          <h2>How Contexta Works</h2>
          <p>Simple, clean, and real-time conversation analysis in three steps.</p>
        </div>
        <div className="pillars-grid">
          <article className="pillar-card">
            <h3>1. Paste Conversation</h3>
            <p>Paste complete dialogue from multiple participants into a single main text box, including names if available.</p>
          </article>
          <article className="pillar-card">
            <h3>2. Automatic Chat Formatting</h3>
            <p>Contexta parses lines into distinct message bubbles for each speaker with individual avatars and timestamps.</p>
          </article>
          <article className="pillar-card">
            <h3>3. Real NLP Insights</h3>
            <p>Inspect resolved references, context understanding, miscommunication risks, clearer message rewrites, and clarification questions.</p>
          </article>
        </div>
        <p className="hero-description" style={{ marginTop: '16px', fontSize: '12px' }}>
          Contexta uses deterministic linguistic rules and semantic role extraction. Private and running entirely on your machine.
        </p>
      </section>
    </div>
  );
}
