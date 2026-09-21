import { useEffect, useState } from "react";
import {
  fetchGlobalStats, fetchAllCountries, fetchHistoricalAll,
  fetchVaccineCoverage, normaliseCountry, toMonthly,
} from "../services/covidApi";
import { SNAPSHOT_COUNTRIES, derive } from "../data/countries";
import { GLOBAL, MONTHS, CUM_CASES, CUM_DEATHS } from "../data/global";

const SNAPSHOT = {
  countries: SNAPSHOT_COUNTRIES,
  global: GLOBAL,
  months: MONTHS,
  cumCases: CUM_CASES,
  cumDeaths: CUM_DEATHS,
  source: "snapshot",
  updated: null,
};

/**
 * Live data from disease.sh, with the bundled snapshot as the fallback.
 *
 * The snapshot renders immediately so nothing ever flashes empty; live figures
 * replace it when (and only when) all four endpoints answer.
 */
export default function useCovidData() {
  const [data, setData] = useState(SNAPSHOT);
  const [status, setStatus] = useState("loading"); // loading | live | snapshot
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [global, rows, historical, vax] = await Promise.all([
          fetchGlobalStats(),
          fetchAllCountries(),
          fetchHistoricalAll(),
          fetchVaccineCoverage().catch(() => []),
        ]);
        if (cancelled) return;

        const doses = new Map(
          (Array.isArray(vax) ? vax : []).map((v) => [
            v.country,
            Object.values(v.timeline || {})[0] || 0,
          ]),
        );
        const snapshotDoses = new Map(SNAPSHOT_COUNTRIES.map((c) => [c.iso2, c.vaxDoses]));

        const countries = rows
          .map(normaliseCountry)
          .filter((c) => c.iso2 && c.population > 0)
          .map((c) => derive({
            ...c,
            vaxDoses: doses.get(c.name) || snapshotDoses.get(c.iso2) || 0,
          }));

        const { months, cumCases, cumDeaths } = toMonthly(historical);

        setData({
          countries,
          global: {
            ...GLOBAL,
            cases: global.cases ?? GLOBAL.cases,
            deaths: global.deaths ?? GLOBAL.deaths,
            recovered: global.recovered ?? GLOBAL.recovered,
            tests: global.tests ?? GLOBAL.tests,
            population: global.population ?? GLOBAL.population,
            countries: global.affectedCountries ?? GLOBAL.countries,
          },
          months: months.length ? months : MONTHS,
          cumCases: months.length ? cumCases : CUM_CASES,
          cumDeaths: months.length ? cumDeaths : CUM_DEATHS,
          source: "live",
          updated: global.updated ? new Date(global.updated) : new Date(),
        });
        setStatus("live");
      } catch (e) {
        if (cancelled) return;
        setError(e);
        setStatus("snapshot");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { ...data, status, error };
}
