import { useMemo, useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import CountryCard from "../components/CountryCard";
import { compact, dec, fmt } from "../utils/format";

const SORTS = {
  cases:    { label: "Most cases",             primary: (c) => compact(c.cases),      secondary: (c) => `${compact(c.deaths)} deaths · ${fmt(c.casesPM)} per million` },
  deaths:   { label: "Most deaths",            primary: (c) => compact(c.deaths),     secondary: (c) => `${fmt(c.deathsPM)} per million · CFR ${dec(c.cfr, 2)}%` },
  casesPM:  { label: "Cases per million",      primary: (c) => fmt(c.casesPM),        secondary: (c) => `${compact(c.cases)} cases total` },
  deathsPM: { label: "Deaths per million",     primary: (c) => fmt(c.deathsPM),       secondary: (c) => `${compact(c.deaths)} deaths total` },
  cfr:      { label: "Case fatality rate",     primary: (c) => `${dec(c.cfr, 2)}%`,   secondary: (c) => `${compact(c.deaths)} of ${compact(c.cases)} confirmed` },
  vaxPct:   { label: "Doses per 100 people",   primary: (c) => dec(c.vaxPct, 0),      secondary: (c) => `${compact(c.vaxDoses)} doses administered` },
  name:     { label: "Name (A–Z)",             primary: (c) => compact(c.cases),      secondary: (c) => `${compact(c.deaths)} deaths · ${fmt(c.deathsPM)} per million` },
};

const PAGE = 12;

export default function ExplorerSection({ countries, onOpen }) {
  const [q, setQ] = useState("");
  const [continent, setContinent] = useState("All");
  const [sort, setSort] = useState("cases");
  const [shown, setShown] = useState(PAGE);

  const continents = useMemo(
    () => ["All", ...[...new Set(countries.map((c) => c.continent))].sort()],
    [countries],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = countries.filter(
      (c) =>
        (continent === "All" || c.continent === continent) &&
        (!needle || c.name.toLowerCase().includes(needle) || c.iso2.toLowerCase() === needle),
    );
    return list.sort(
      sort === "name" ? (a, b) => a.name.localeCompare(b.name) : (a, b) => b[sort] - a[sort],
    );
  }, [countries, q, continent, sort]);

  const reset = (fn) => (e) => { fn(e.target.value); setShown(PAGE); };
  const meta = SORTS[sort];

  return (
    <section id="countries" aria-labelledby="c-t">
      <div className="wrap">
        <SectionHead
          id="c-t"
          kicker={`${countries.length} countries and territories in this dataset`}
          title="Country by country"
        >
          Sort by raw totals and the biggest countries win by default. Sort per million and the
          ranking turns over completely.
        </SectionHead>

        <Reveal className="filters">
          <div className="search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <input type="search" value={q} onChange={reset(setQ)} placeholder="Search countries" aria-label="Search countries" />
          </div>
          <select className="sel" value={continent} onChange={reset(setContinent)} aria-label="Filter by continent">
            {continents.map((c) => <option key={c} value={c}>{c === "All" ? "All continents" : c}</option>)}
          </select>
          <select className="sel" value={sort} onChange={reset(setSort)} aria-label="Sort by">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="empty">Nothing matches “{q}”. Try a different name, or reset the continent filter.</div>
        ) : (
          <>
            <div className="cgrid">
              {filtered.slice(0, shown).map((c, i) => (
                <CountryCard
                  key={c.iso2 + c.name}
                  country={c}
                  index={i}
                  primary={meta.primary(c)}
                  secondary={meta.secondary(c)}
                  onOpen={onOpen}
                />
              ))}
            </div>
            {shown < filtered.length && (
              <div className="more-row">
                <button className="ghost-btn" onClick={() => setShown((s) => s + PAGE)}>
                  Show {Math.min(PAGE, filtered.length - shown)} more of {filtered.length}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
