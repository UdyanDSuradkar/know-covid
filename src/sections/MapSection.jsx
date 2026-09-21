import { useMemo, useState } from "react";
import SectionHead from "../components/SectionHead";
import Segmented from "../components/Segmented";
import Reveal from "../components/Reveal";
import { MAP_METRICS } from "../constants";
import { compact, dec, fmt, resolveVar } from "../utils/format";

const W = 1000, H = 520, LAT_TOP = 82, LAT_BOT = -58;
const projX = (lng) => ((lng + 180) / 360) * W;
const projY = (lat) => ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * H;

const FORMATTERS = {
  cases:    (v) => `${compact(v)} cases`,
  deaths:   (v) => `${compact(v)} deaths`,
  deathsPM: (v) => `${fmt(v)} per million`,
  vaxPct:   (v) => `${dec(v, 0)} per 100`,
};

export default function MapSection({ countries, onOpen }) {
  const [metric, setMetric] = useState("cases");
  const [continent, setContinent] = useState("All");
  const [tip, setTip] = useState(null);

  const continents = useMemo(
    () => ["All", ...[...new Set(countries.map((c) => c.continent))].sort()],
    [countries],
  );

  const { bubbles, radius, colour, max } = useMemo(() => {
    const key = MAP_METRICS[metric].key;
    const mx = Math.max(...countries.map((c) => c[key] || 0), 1);
    const r = (v) => Math.max(2.4, Math.sqrt((v || 0) / mx) * 33);
    const list = countries
      .filter((c) => continent === "All" || c.continent === continent)
      .slice()
      .sort((a, b) => (b[key] || 0) - (a[key] || 0));
    return { bubbles: list, radius: r, colour: resolveVar(MAP_METRICS[metric].color), max: mx };
  }, [countries, metric, continent]);

  const graticule = useMemo(() => {
    const lines = [];
    for (let lng = -180; lng <= 180; lng += 30)
      lines.push(<line key={`v${lng}`} className="grat" x1={projX(lng)} y1={0} x2={projX(lng)} y2={H} />);
    for (let lat = LAT_BOT; lat <= LAT_TOP; lat += 20)
      lines.push(<line key={`h${lat}`} className="grat" x1={0} y1={projY(lat)} x2={W} y2={projY(lat)} />);
    lines.push(<line key="eq" className="grat-major" x1={0} y1={projY(0)} x2={W} y2={projY(0)} />);
    return lines;
  }, []);

  const key = MAP_METRICS[metric].key;

  return (
    <section id="map" aria-labelledby="map-t">
      <div className="wrap">
        <SectionHead
          id="map-t"
          kicker="Positioned by true latitude and longitude · area scaled to value"
          title="Where it landed"
        >
          Continents draw themselves out of the data. Switch the measure to see how differently
          the burden falls once you divide by population.
        </SectionHead>

        <Reveal className="map-shell">
          <div className="map-bar">
            <Segmented
              label="Map measure"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "cases", label: "Cases" },
                { value: "deaths", label: "Deaths" },
                { value: "deathsPM", label: "Deaths per million" },
                { value: "vaxPct", label: "Doses per 100" },
              ]}
            />
            <div className="pill-row">
              {continents.map((c) => (
                <button key={c} className="pill" aria-pressed={continent === c} onClick={() => setContinent(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="map-canvas">
            <svg id="worldmap" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="World bubble map of COVID-19 burden"
                 onPointerLeave={() => setTip(null)}>
              <g>
                {graticule}
                <text x="6" y={projY(0) - 5}
                      style={{ fontFamily: "var(--mono)", fontSize: 8, fill: "var(--muted)", opacity: 0.6 }}>
                  equator
                </text>
              </g>
              <g>
                {bubbles.map((c) => {
                  const x = projX(c.lng), y = projY(c.lat), r = radius(c[key]);
                  return (
                    <g key={c.iso2 + c.name} className="mapdot" tabIndex={0} role="button"
                       aria-label={`${c.name}: ${FORMATTERS[metric](c[key])}`}
                       onPointerMove={(e) => setTip({ c, x: e.clientX, y: e.clientY })}
                       onClick={() => onOpen(c)}
                       onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(c); } }}>
                      <circle className="halo" cx={x} cy={y} r={r + 7} fill={colour} />
                      <circle cx={x} cy={y} r={r} fill={colour} fillOpacity=".26" stroke={colour} strokeOpacity=".8" strokeWidth="1" />
                      <circle cx={x} cy={y} r="1.4" fill={colour} />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="map-legend">
            <span>{MAP_METRICS[metric].label}</span>
            <span className="legend-sizes">
              {[max, max / 4, max / 25].map((t, i) => {
                const r = radius(t);
                return (
                  <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <svg width={r * 2 + 2} height={r * 2 + 2}>
                      <circle cx={r + 1} cy={r + 1} r={r} fill="none" stroke={colour} strokeOpacity=".6" />
                    </svg>
                    <span>{compact(t)}</span>
                  </span>
                );
              })}
            </span>
            <span style={{ marginLeft: "auto" }}>Hover or tap a bubble for detail</span>
          </div>
        </Reveal>
      </div>

      <div id="maptip" className={tip ? "show" : ""} role="status" aria-live="polite"
           style={tip ? { left: tip.x, top: tip.y } : undefined}>
        {tip && (
          <>
            <div className="t">{tip.c.flag} {tip.c.name}</div>
            <div className="r"><span>Cases</span><b>{compact(tip.c.cases)}</b></div>
            <div className="r"><span>Deaths</span><b>{compact(tip.c.deaths)}</b></div>
            <div className="r"><span>Deaths / million</span><b>{fmt(tip.c.deathsPM)}</b></div>
            <div className="r"><span>Doses / 100</span><b>{dec(tip.c.vaxPct, 0)}</b></div>
          </>
        )}
      </div>
    </section>
  );
}
