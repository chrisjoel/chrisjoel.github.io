"use client";
import { useEffect, useState } from "react";

export default function Typing({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(words[0].length);
  const [erasing, setErasing] = useState(false);
  useEffect(() => {
    const w = words[i];
    const wait = !erasing && n === w.length ? 1600 : erasing ? 35 : 75;
    const t = setTimeout(() => {
      if (!erasing) { if (n < w.length) setN(n + 1); else setErasing(true); }
      else if (n > 0) setN(n - 1);
      else { setErasing(false); setI((i + 1) % words.length); }
    }, wait);
    return () => clearTimeout(t);
  }, [n, erasing, i, words]);
  return <span className="typing" aria-label={words[0]}>{words[i].slice(0, n)}<span className="caret" aria-hidden="true" /></span>;
}
