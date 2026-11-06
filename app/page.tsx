import Typing from "./components/Typing";
import AboutStack from "./components/AboutStack";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import { profile, experience } from "./data";

const nav = ["about", "experience", "projects", "certifications", "contact"];

export default function Home() {
  return (
    <>
      <header className="top">
        <div className="wrap bar">
          <a className="brand" href="#top">{profile.name}</a>
          <nav aria-label="Main">
            {nav.map((s) => <a key={s} href={`#${s}`}>{s[0].toUpperCase() + s.slice(1)}</a>)}
          </nav>
        </div>
      </header>
      <main id="top" className="wrap">
        <div className="hero">
          <div>
            <h1>{profile.name}</h1>
            <p className="role"><Typing words={profile.roles} /></p>
            <p className="lead">{profile.intro}</p>
            <div className="btns">
              <a className="btn" href="#projects">View projects<span aria-hidden="true">→</span></a>
              <a className="btn alt" href="/Joel-Ebenka-CV.pdf">Download CV<span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="term" role="img" aria-label="Terminal summary of Joel's profile">
            <div><span className="p">$</span> whoami</div><div className="o">joel-ebenka, devops-engineer</div>
            <div><span className="p">$</span> cloud list</div><div className="o">aws  azure  gcp</div>
            <div><span className="p">$</span> status</div><div className="o">open to remote roles</div>
          </div>
        </div>

        <section id="about">
          <h2>About</h2>
          <AboutStack />
        </section>

        <section id="experience">
          <h2>Experience</h2>
          {experience.map((e) => (
            <article className="job" key={e.company}>
              <h3>{e.title}, {e.company}</h3>
              <p className="meta">{e.period}. {e.place}</p>
              <ul className="plain">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <Projects />
        </section>

        <section id="certifications">
          <h2>Certifications and badges</h2>
          <Certifications />
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p className="lead wide">I am open to full remote DevOps and Cloud Engineering roles, and to relocation.</p>
          <div className="social">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><img src="/logos/github.svg" alt="" width={32} height={32} /><span>GitHub</span></a>
            <a href={`mailto:${profile.email}`} aria-label={`Send an email to ${profile.email}`}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg><span>Email</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><img src="/logos/linkedin.svg" alt="" width={32} height={32} /><span>LinkedIn</span></a>
          </div>
          <p className="meta">{profile.email}</p>
        </section>
      </main>
      <footer><div className="wrap">&copy; 2026 {profile.name}</div></footer>
    </>
  );
}
