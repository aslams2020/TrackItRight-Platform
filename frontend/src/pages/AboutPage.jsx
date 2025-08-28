import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">Why I Built <span>TrackItRight?⚡</span></h1>

      <p className="about-intro">
        TrackItRight started with a simple question that kept coming back: why do civic complaints feel like they disappear the moment they’re submitted? A broken streetlight stays dark, a pothole keeps growing, and the only update is silence. As a Computer Science student, that didn’t sit right with me. I wanted a simple, honest way to show what’s happening from the moment a complaint is raised to the moment it’s resolved.
      </p>

      <section className="about-section">
        <h2>🌍 The Problem</h2>
        <p>
          Most people never see what happens after they report an issue. The process is hidden, timelines are unclear, and ownership is hard to find. That uncertainty turns effort into frustration and slowly erodes trust. I believe public systems should feel visible and accountable, not distant and opaque.
        </p>
      </section>

      <section className="about-section">
        <h2>💡 The Motive</h2>
        <p>
          The idea behind TrackItRight is straightforward: make complaints trackable like a parcel—clear stages, clear status, and clear responsibility. From submission to resolution, each step should be visible. Not to add noise, but to give dignity to the process and confidence to the person who spoke up.
        </p>
      </section>

      <section className="about-section">
        <h2>⚡ The Journey</h2>
        <p>
          The first version was rough. Authentication had sharp edges, the database wasn’t happy, and the UI didn’t say much. But each iteration made the system simpler and more transparent. Today, TrackItRight is growing from a student project into something useful: a place where issues don’t vanish, progress is visible, and communities can hold systems to their word.
        </p>
      </section>
    </div>
  );
}
