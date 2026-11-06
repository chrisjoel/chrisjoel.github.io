"use client";
import { useState } from "react";
import { projects } from "../data";

const filters = ["All", "Terraform", "AWS", "Kubernetes", "CI/CD"];

export default function Projects() {
  const [active, setActive] = useState("All");
  const shown = projects.filter((p) => active === "All" || p.cats.includes(active));
  return (
    <>
      <div className="chips" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f} type="button" className={"chip" + (f === active ? " on" : "")} aria-pressed={f === active} onClick={() => setActive(f)}>{f}</button>
        ))}
      </div>
      <div className="pgrid">
        {shown.map((p) => (
          <article className="pcard" key={p.name}>
            <div className="plogos">{p.logos.map((l) => <img key={l} src={`/logos/${l}.svg`} alt={l} width={30} height={30} />)}</div>
            <h3>{p.name}</h3>
            <p className="meta">{p.text}</p>
            {p.href
              ? <a className="btn" href={p.href} target="_blank" rel="noopener noreferrer">View on GitHub<span aria-hidden="true">→</span></a>
              : <span className="soon">Repository link coming soon</span>}
          </article>
        ))}
      </div>
    </>
  );
}
