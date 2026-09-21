/**
 * disease.sh client.
 *
 * Every call is wrapped so a failure (offline, rate limit, CORS) never breaks
 * the page — the caller falls back to the bundled snapshot instead.
 */
const BASE = "https://disease.sh/v3/covid-19";
const TIMEOUT = 8000;

async function get(path) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE}${path}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const fetchGlobalStats = () => get("/all");
export const fetchAllCountries = () => get("/countries?allowNull=false");
export const fetchCountry = (name) => get(`/countries/${encodeURIComponent(name)}`);
export const fetchHistoricalAll = () => get("/historical/all?lastdays=all");
export const fetchVaccineCoverage = () =>
  get("/vaccine/coverage/countries?lastdays=1&fullData=false");

/** Live /countries row -> the shape the UI expects. */
export function normaliseCountry(row) {
  return {
    name: row.country,
    iso2: row.countryInfo?.iso2 || "",
    continent: row.continent || "Other",
    lat: row.countryInfo?.lat ?? 0,
    lng: row.countryInfo?.long ?? 0,
    population: row.population || 0,
    cases: row.cases || 0,
    deaths: row.deaths || 0,
    recovered: row.recovered || 0,
    tests: row.tests || 0,
    vaxDoses: 0, // filled in from the vaccine endpoint
  };
}

/** Daily {"M/D/YY": n} maps -> month-end cumulative series. */
export function toMonthly(historical) {
  const cases = historical?.cases || {};
  const deaths = historical?.deaths || {};
  const byMonth = new Map();
  for (const key of Object.keys(cases)) {
    const [m, d, y] = key.split("/");
    const stamp = `20${y}-${String(m).padStart(2, "0")}`;
    const prev = byMonth.get(stamp);
    if (!prev || +d > prev.day) {
      byMonth.set(stamp, { day: +d, cases: cases[key], deaths: deaths[key] ?? 0 });
    }
  }
  const months = [...byMonth.keys()].sort();
  return {
    months,
    cumCases: months.map((m) => byMonth.get(m).cases),
    cumDeaths: months.map((m) => byMonth.get(m).deaths),
  };
}
