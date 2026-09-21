export const NAV_LINKS = [
  { name: "Scale",    link: "#scale" },
  { name: "Map",      link: "#map" },
  { name: "Timeline", link: "#timeline" },
  { name: "Countries",link: "#countries" },
  { name: "Compare",  link: "#compare" },
  { name: "Variants", link: "#variants" },
  { name: "Symptoms", link: "#symptoms" },
  { name: "Risk",     link: "#risk" },
];

export const ROUTES = [
  { name: "Home",          link: "/" },
  { name: "Global stats",  link: "/global" },
  { name: "Country stats", link: "/country" },
  { name: "About",         link: "/about" },
];

export const SECTION_IDS = NAV_LINKS.map((l) => l.link.slice(1));

export const MAP_METRICS = {
  cases:    { label: "Bubble area ≡ confirmed cases",      color: "var(--saline)",    key: "cases" },
  deaths:   { label: "Bubble area ≡ confirmed deaths",     color: "var(--clot-lift)", key: "deaths" },
  deathsPM: { label: "Bubble area ≡ deaths per million",   color: "var(--clot-lift)", key: "deathsPM" },
  vaxPct:   { label: "Bubble area ≡ doses per 100 people", color: "var(--serum)",     key: "vaxPct" },
};

export const WAVES = [
  { from: "2020-01", to: "2020-11", n: "Original" },
  { from: "2020-12", to: "2021-05", n: "Alpha" },
  { from: "2021-06", to: "2021-11", n: "Delta" },
  { from: "2021-12", to: "2023-12", n: "Omicron and descendants" },
];

export const COMPARE_COLORS = ["var(--saline)", "var(--serum)", "var(--oxygen)", "var(--clot-lift)"];
