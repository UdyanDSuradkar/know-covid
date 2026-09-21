import { useEffect, useMemo, useRef } from "react";
import { compact, dec, fmt, ordinal } from "../utils/format";

export default function CountryDrawer({ country: c, countries, onClose }) {
  const closeRef = useRef(null);
  const open = Boolean(c);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ranks = useMemo(() => {
    if (!c) return {};
    const rank = (k) =>
      [...countries].sort((a, b) => b[k] - a[k]).findIndex((x) => x.iso2 === c.iso2) + 1;
    return { cases: rank("cases"), deathsPM: rank("deathsPM") };
  }, [c, countries]);

  const rows = c && [
    ["Confirmed cases", fmt(c.cases)],
    ["Confirmed deaths", fmt(c.deaths)],
    ["Recovered", fmt(c.recovered)],
    ["Cases per million", fmt(c.casesPM)],
    ["Deaths per million", fmt(c.deathsPM)],
    ["Case fatality rate", `${dec(c.cfr, 2)}%`],
    ["Tests conducted", compact(c.tests)],
    ["Tests per million", compact(c.testsPM)],
    ["Vaccine doses", compact(c.vaxDoses)],
    ["Doses per 100 people", dec(c.vaxPct, 0)],
  ];
  const total = c ? c.deaths + c.recovered + c.active || 1 : 1;

  return (
    <div className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="dTitle">
      <div className="scrim" onClick={onClose} />
      <div className="panel">
        <button ref={closeRef} className="x" onClick={onClose} aria-label="Close">×</button>
        {c && (
          <div>
            <div style={{ fontSize: "2.4rem", lineHeight: 1 }}>{c.flag}</div>
            <h2 className="sec-title" id="dTitle" style={{ fontSize: "1.85rem", margin: ".5rem 0 .2rem" }}>
              {c.name}
            </h2>
            <p className="note" style={{ marginBottom: "1.2rem" }}>
              {c.continent} · population {compact(c.population)} ·{" "}
              {ranks.cases}{ordinal(ranks.cases)} worldwide by cases,{" "}
              {ranks.deathsPM}{ordinal(ranks.deathsPM)} by deaths per million
            </p>
            <div className="ratio" style={{ height: 7, marginBottom: "1.3rem" }}>
              <i style={{ width: `${(c.recovered / total) * 100}%`, background: "var(--oxygen)" }} />
              <i style={{ width: `${(c.active / total) * 100}%`, background: "var(--saline)" }} />
              <i style={{ width: `${(c.deaths / total) * 100}%`, background: "var(--clot)" }} />
            </div>
            {rows.map(([k, v]) => (
              <div className="dstat" key={k}>
                <span className="k">{k}</span><span className="v">{v}</span>
              </div>
            ))}
            <p className="note" style={{ marginTop: "1.2rem" }}>
              Figures are cumulative reported totals. Testing rates varied enormously between
              countries, so case counts and fatality rates are only loosely comparable; deaths
              per million is the steadier measure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
