import { useEffect, useMemo, useRef, useState } from "react";
import { compact } from "../utils/format";
import { SECTION_IDS } from "../constants";

export default function CommandPalette({ open, countries, onClose, onPick }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQ(""); setSel(0);
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const items = useMemo(() => {
    const v = q.trim().toLowerCase();
    const secs = SECTION_IDS
      .filter((id) => !v || id.includes(v))
      .map((id) => ({ type: "section", id, name: id[0].toUpperCase() + id.slice(1) }));
    const hits = countries
      .filter((c) => !v || c.name.toLowerCase().includes(v))
      .slice(0, v ? 8 : 6)
      .map((c) => ({ type: "country", country: c }));
    return v ? [...hits, ...secs] : [...secs, ...hits];
  }, [q, countries]);

  useEffect(() => { setSel(0); }, [q]);
  if (!open) return null;

  const run = (i) => {
    const it = items[i];
    if (!it) return;
    onClose();
    if (it.type === "section") document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth" });
    else onPick(it.country);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.min(items.length - 1, Math.max(0, s + (e.key === "ArrowDown" ? 1 : -1))));
    }
    if (e.key === "Enter") { e.preventDefault(); run(sel); }
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="cmdk open" role="dialog" aria-modal="true" aria-label="Find a country">
      <div className="scrim" onClick={onClose} />
      <div className="box">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a country or a section…"
          autoComplete="off"
          spellCheck="false"
        />
        <div className="results" role="listbox">
          {items.length === 0 ? (
            <div className="note" style={{ padding: "1rem" }}>
              Nothing found. Try a country name or a section.
            </div>
          ) : items.map((it, i) => (
            <button
              key={it.type === "section" ? it.id : it.country.iso2}
              className="cres"
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onClick={() => run(i)}
            >
              {it.type === "section"
                ? <>→ {it.name}<span className="rt">section</span></>
                : <>{it.country.flag} {it.country.name}<span className="rt">{compact(it.country.cases)} cases</span></>}
            </button>
          ))}
        </div>
        <div className="foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>
  );
}
