"use client";
import { useRef, useState } from "react";
import { certifications, type Cert } from "../data";

const img = (c: Cert) => c.badge ?? `/logos/${c.logo}.svg`;

export default function Certifications() {
  const ref = useRef<HTMLDialogElement>(null);
  const [sel, setSel] = useState<Cert | null>(null);
  const open = (c: Cert) => { setSel(c); ref.current?.showModal(); };
  const close = () => ref.current?.close();
  return (
    <div className="certs">
      <div className="cgrid">
        {certifications.map((c) => (
          <button key={c.id} type="button" className="ccard" aria-haspopup="dialog" onClick={() => open(c)}>
            <span className={"clogo" + (c.badge ? " badge" : "")}><img src={img(c)} alt="" width={c.badge ? 96 : 44} height={c.badge ? 96 : 44} /></span>
            <strong>{c.name}</strong>
            <span>{c.issuer}</span>
          </button>
        ))}
      </div>
      <dialog ref={ref} className="cmodal" aria-labelledby="cert-title" onClose={() => setSel(null)} onClick={(e) => { if (e.target === ref.current) close(); }}>
        {sel && (
          <div className="cbody">
            <button type="button" className="cclose" onClick={close} aria-label="Close details">×</button>
            <span className={"clogo big" + (sel.badge ? " badge" : "")}><img src={img(sel)} alt={`${sel.name} badge`} width={sel.badge ? 140 : 60} height={sel.badge ? 140 : 60} /></span>
            <h3 id="cert-title">{sel.name}</h3>
            <p className="meta">{sel.issuer}</p>
            <dl className="cdl">
              {sel.issued && <div><dt>Issued</dt><dd>{sel.issued}</dd></div>}
              {sel.credentialId && <div className="wide"><dt>Credential ID</dt><dd className="cid">{sel.credentialId}</dd></div>}
            </dl>
            {sel.description && <p className="meta">{sel.description}</p>}
            {sel.skills.length > 0 && <div className="tags">{sel.skills.map((s) => <span key={s}>{s}</span>)}</div>}
            {sel.url && <p><a className="btn" href={sel.url} target="_blank" rel="noopener noreferrer">Verify credential<span aria-hidden="true">→</span></a></p>}
          </div>
        )}
      </dialog>
    </div>
  );
}
