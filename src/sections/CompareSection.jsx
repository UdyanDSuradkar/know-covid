import { useEffect, useMemo, useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import { COMPARE_COLORS } from "../constants";
import { compact, dec, fmt } from "../utils/format";

const ROWS = [
  { k: "cases",    n: "Confirmed cases",      f: (v) => compact(v) },
  { k: "deaths",   n: "Confirmed deaths",     f: (v) => compact(v) },
  { k: "casesPM",  n: "Cases per million",    f: (v) => fmt(v) },
  { k: "deathsPM", n: "Deaths per million",   f: (v) => fmt(v) },
  { k: "cfr",      n: "Case fatality rate",   f: (v) => `${dec(v, 2)}%` },
  { k: "testsPM",  n: "Tests per million",    f: (v) => compact(v) },
  { k: "vaxPct",   n: "Doses per 100 people", f: (v) => dec(v, 0) },
];

export default function CompareSection({ countries }) {
  const [picked, setPicked] = useState([]);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const defaults = ["IN", "US", "BR", "DE"]
      .map((iso) => countries.find((c) => c.iso2 === iso))
      .filter(Boolean);
    setPicked(defaults);
  }, [countries]);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, [picked]);

  const suggestions = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return [];
    return countries
      .filter((c) => c.name.toLowerCase().includes(v) && !picked.some((p) => p.iso2 === c.iso2))
      .slice(0, 5);
  }, [q, countries, picked]);

  const add = (c) => {
    setMounted(false);
    setPicked((p) => (p.length >= 4 ? [...p.slice(1), c] : [...p, c]));
    setQ("");
  };
  const remove = (iso) => { setMounted(false); setPicked((p) => p.filter((c) => c.iso2 !== iso)); };

  return (
    <section id="compare" aria-labelledby="cmp-t">
      <div className="wrap">
        <SectionHead
          id="cmp-t"
          kicker="Pick up to four · every bar is scaled to the leader in that row"
          title="Put them side by side"
        >
          Raw totals flatter small countries and punish large ones. The per-million rows are the
          ones worth arguing about.
        </SectionHead>

        <Reveal className="cmp-wrap">
          <div>
            <div className="chiplist">
              {picked.length === 0
                ? <span className="note">No countries selected. Add up to four below.</span>
                : picked.map((c, i) => (
                    <span className="chip" key={c.iso2}>
                      <b style={{ background: COMPARE_COLORS[i] }} />
                      {c.flag} {c.name}
                      <button onClick={() => remove(c.iso2)} aria-label={`Remove ${c.name}`}>×</button>
                    </span>
                  ))}
            </div>

            <div className="search" style={{ marginTop: ".9rem", maxWidth: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
                     placeholder="Add a country" aria-label="Add a country to compare" autoComplete="off" />
            </div>

            <div style={{ marginTop: ".5rem" }}>
              {q.trim() && suggestions.length === 0 && <span className="note">No match. Try another spelling.</span>}
              {suggestions.map((c) => (
                <button className="cres" key={c.iso2} onClick={() => add(c)}>
                  {c.flag} {c.name}<span className="rt">{compact(c.cases)}</span>
                </button>
              ))}
            </div>

            <p className="note" style={{ marginTop: "1rem" }}>
              Doses per 100 can exceed 100 because it counts every dose given, including boosters.
            </p>
          </div>

          <div className="bars">
            {ROWS.map((r) => {
              const max = Math.max(...picked.map((c) => c[r.k]), 1e-9);
              return (
                <div className="barrow" key={r.k}>
                  <div className="bl"><span>{r.n}</span><span>leader {r.f(max)}</span></div>
                  <div className="barset">
                    {picked.map((c, i) => (
                      <div className="bline" key={c.iso2}>
                        <span className="nm" title={c.name}>{c.flag} {c.name}</span>
                        <span className="btrack">
                          <i className="bfill"
                             style={{ background: COMPARE_COLORS[i], width: mounted ? `${(c[r.k] / max) * 100}%` : 0 }} />
                        </span>
                        <span className="vv num">{r.f(c[r.k])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
