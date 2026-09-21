/* Variant shares, week ending 16 Aug 2026 (WHO / GISAID).
   28-day surveillance figures, 3-30 Aug 2026. */
export const VARIANTS = [
  {name:"XFG",        pct:41, prev:28, cls:"VUM", color:"var(--saline)"},
  {name:"NB.1.8.1",   pct:17, prev:21, cls:"VUM", color:"var(--oxygen)"},
  {name:"PQ.16.1.1",  pct:15, prev:17, cls:"VUM", color:"var(--serum)"},
  {name:"JN.1",       pct:9,  prev:11, cls:"VOI", color:"var(--clot-lift)"},
  {name:"BA.3.2",     pct:3,  prev:3,  cls:"VUM", color:"var(--muted)"},
  {name:"Other lineages", pct:15, prev:20, cls:"", color:"var(--ink-4)"}
];

export const SURVEILLANCE = {
  // Bump this to today's date whenever the figures below are refreshed by hand —
  // it drives the "updated Xd ago" badge on the Variants section. Nothing in this
  // file is fetched live; disease.sh has no variant-surveillance endpoint.
  asOf: "2026-08-30",
  periodLabel: "3–30 August 2026",
  weekLabel: "week of 24–30 August 2026",
  newCases: 62847, prevCases: 41695,
  newDeaths: 279,  prevDeaths: 242,
  hospitalisations: 1492, icu: 53,
  positivity: 2.5, samples: 51115,
  reportingCountries: 58, testingCountries: 73,
};
