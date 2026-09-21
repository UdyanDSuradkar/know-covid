# 🦠 Know Covid — The Chart Room

A COVID-19 observatory: four years of global figures made legible, plus current WHO
surveillance. Built with React 19, Vite and hand-written SVG/Canvas — no chart library.

**Live demo:** _add your Vercel URL here_

---

## What's in it

| Section | What it does |
| --- | --- |
| **Hero** | A canvas field where one dot = 1,000 confirmed deaths, igniting across 2020–2023 in twelve seconds. Replayable. |
| **Scale** | Four cumulative totals that count up on scroll, each with an inline sparkline of its own series. |
| **Map** | A world bubble map projected from real latitude/longitude — no map library, no tile server. Switch between cases, deaths, deaths per million and doses per 100; filter by continent; click any bubble for the full country panel. |
| **Timeline** | Scrubbable SVG chart of the monthly series. Cumulative or new-per-month, linear or log, with variant-era bands marked. |
| **Countries** | Search, filter by continent, and sort seven ways. Sorting by per-million measures completely reorders the table — that's the point. |
| **Compare** | Up to four countries side by side across seven measures, each bar scaled to the row leader. |
| **Variants** | Current WHO/GISAID lineage shares and the last 28 days of surveillance. |
| **Symptoms** | An interactive body diagram cross-linked to a frequency-ranked symptom list. |
| **Risk** | A live particle model of a shared indoor hour. Stack six protections and watch the multiplicative effect. |
| **Everywhere** | ⌘K / `/` command palette, light and dark themes, full keyboard navigation, `prefers-reduced-motion` respected. |

## Data

Live figures come from the [disease.sh](https://disease.sh/) API — `/all`, `/countries`,
`/historical/all` and `/vaccine/coverage/countries`. If any of those fail (offline, rate
limit, CORS), the app falls back to a bundled snapshot in `src/data/` rather than showing
an error, and the footer says which source is in use.

The snapshot holds 127 countries compiled from the WHO COVID-19 dashboard and the Johns
Hopkins CSSE series, which closed on 10 March 2023. Surveillance and variant figures are
from the WHO dashboard for 3–30 August 2026.

**The Variants section does not update on its own.** disease.sh has no variant-surveillance
endpoint, so those figures live as plain constants in `src/data/variants.js` and only change
when someone edits them. A small badge next to that section's heading shows how long ago
`SURVEILLANCE.asOf` was last bumped — green under 45 days, amber to 120, red beyond that — so
staleness is visible instead of silent. To refresh it: update the numbers in `variants.js`
and set `asOf` to today's date.

Reported totals are a floor, not a ceiling. WHO's excess-mortality work put roughly 14.9
million additional deaths in 2020–2021 alone, against about 5.4 million reported over the
same period.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

Requires Node 18+.

## Structure

```
src/
├─ components/   Navbar, Footer, Ticker, StatSlab, CountryCard,
│                CountryDrawer, CommandPalette, Reveal, Segmented, SectionHead
├─ sections/     One file per section of the page
├─ pages/        Home, GlobalStats, CountryStats, AboutCovid, NotFound
├─ hooks/        useCovidData, useTheme, useReveal, useCountUp,
│                useScrollSpy, useReducedMotion
├─ data/         Offline snapshot: countries, global series, variants,
│                symptoms, risk layers, FAQs
├─ services/     disease.sh client + response normalisers
├─ utils/        Number and date formatting
└─ index.css     The whole design system, as CSS custom properties
```

## Design notes

The palette is deliberately not the usual dashboard black-plus-neon. It's a blue-leaning
ink (`--ink: #0A1017`) with warm bone text, and a data palette borrowed from clinical
diagnostics: saline blue for cases, oxygen green for recoveries, a somber dried-clot red
for deaths, serum amber for vaccines. Typography is Newsreader (editorial serif, italics
reserved for the human voice), Archivo (UI), and DM Mono for numerals only.

Every colour is a custom property on `:root`, redefined under `[data-theme="light"]`, so
the theme toggle is a single attribute swap. Canvas and SVG read the resolved values at
paint time and repaint on a `kc:themechange` event.

## Not medical advice

The risk model uses illustrative reduction values combined multiplicatively to show how
layered protections compound. It is not a clinical prediction. For anything about your own
health, talk to a clinician.

## Credits

Data: [WHO COVID-19 dashboard](https://data.who.int/dashboards/covid19/summary),
[disease.sh](https://disease.sh/), [Our World in Data](https://ourworldindata.org/coronavirus).
