import { compact } from "../utils/format";
import { SURVEILLANCE } from "../data/variants";

export default function Ticker({ global }) {
  const S = SURVEILLANCE;
  const ticks = [
    [`Test positivity, ${S.weekLabel}`, `${S.positivity}%`],
    [`Samples tested across ${S.testingCountries} countries`, S.samples.toLocaleString()],
    [`New cases, 28 days to 30 Aug 2026`, S.newCases.toLocaleString()],
    ["New deaths, same period", S.newDeaths.toLocaleString()],
    ["Hospital admissions reported", S.hospitalisations.toLocaleString()],
    ["ICU admissions reported", S.icu.toLocaleString()],
    ["Dominant lineage", "XFG at 41%"],
    ["Cumulative confirmed cases", compact(global.cases)],
    ["Cumulative confirmed deaths", compact(global.deaths)],
    ["Vaccine doses administered", compact(global.vaxDoses)],
  ];
  const doubled = [...ticks, ...ticks];

  return (
    <div className="ticker" aria-label="Current surveillance summary">
      <div className="ticker-row">
        {doubled.map(([k, v], i) => (
          <span className="tick" key={i}>
            {(i === 0 || i === ticks.length) && <span className="dot" />}
            {k} <b>{v}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
