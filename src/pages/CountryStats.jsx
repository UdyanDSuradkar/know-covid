import { useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import ExplorerSection from "../sections/ExplorerSection";
import CompareSection from "../sections/CompareSection";
import { compact, dec, fmt } from "../utils/format";

/** Kept as a standalone route so /country still resolves. */
export default function CountryStats({ data, onOpenCountry }) {
  const { countries } = data;
  const [name, setName] = useState("India");
  const country = countries.find((c) => c.name === name) || countries[0];

  const picks = ["India", "United States", "Brazil", "Russia", "United Kingdom", "France"]
    .filter((n) => countries.some((c) => c.name === n));

  return (
    <div style={{ paddingTop: 62 }}>
      <section>
        <div className="wrap">
          <SectionHead
            kicker="A single country, in full"
            title="Country statistics"
          >
            The same figures the explorer uses below, for one country at a time.
          </SectionHead>

          <Reveal className="filters">
            <select className="sel" value={name} onChange={(e) => setName(e.target.value)} aria-label="Choose a country">
              {picks.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Reveal>

          {country && (
            <Reveal className="slabs">
              {[
                ["Confirmed cases", fmt(country.cases), "var(--saline)"],
                ["Confirmed deaths", fmt(country.deaths), "var(--clot-lift)"],
                ["Deaths per million", fmt(country.deathsPM), "var(--clot-lift)"],
                ["Case fatality rate", `${dec(country.cfr, 2)}%`, "var(--serum)"],
                ["Tests conducted", compact(country.tests), "var(--bone)"],
                ["Doses per 100 people", dec(country.vaxPct, 0), "var(--oxygen)"],
              ].map(([k, v, colour]) => (
                <div className="slab in" key={k} style={{ "--accent": colour }}>
                  <span className="k">{k}</span>
                  <span className="v num">{v}</span>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <ExplorerSection countries={countries} onOpen={onOpenCountry} />
      <CompareSection countries={countries} />
    </div>
  );
}
