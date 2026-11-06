"use client";
import { useState } from "react";
import { profile, tools, toolCats, alsoUse } from "../data";

export default function AboutStack() {
  const [cat, setCat] = useState("All");
  const shown = tools.filter((t) => cat === "All" || t.cat === cat);
  return (
    <div className="about">
      <div className="abio">
        <p>{profile.about}</p>
        <ul className="facts">
          <li>Yaoundé, Cameroon</li><li>English and French</li><li>Remote or relocation</li>
        </ul>
      </div>
      <div>
        <div className="chips sm" role="group" aria-label="Filter tools by category">
          {toolCats.map((c) => (
            <button key={c} type="button" className={"chip" + (c === cat ? " on" : "")} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <ul className="tools sm">
          {shown.map((t) => <li key={t.name}><img src={`/logos/${t.logo}.svg`} alt="" width={30} height={30} /><span>{t.name}</span></li>)}
        </ul>
        <p className="also"><strong>Also:</strong> {alsoUse}</p>
      </div>
    </div>
  );
}
