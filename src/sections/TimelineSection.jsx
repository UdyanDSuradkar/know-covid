import { useMemo, useRef, useState } from "react";
import SectionHead from "../components/SectionHead";
import Segmented from "../components/Segmented";
import Reveal from "../components/Reveal";
import { WAVES } from "../constants";
import { clamp, compact, cssVar, dec, fmt, monthLabel } from "../utils/format";

const W = 1000, H = 380, ML = 62, MR = 16, MT = 26, MB = 34;
const IW = W - ML - MR, IH = H - MT - MB;

export default function TimelineSection({ months, cumCases, cumDeaths }) {
  const [metric, setMetric] = useState("cases");
  const [mode, setMode] = useState("cumulative");
  const [scale, setScale] = useState("linear");
  const [scrub, setScrub] = useState(null);
  const svgRef = useRef(null);

  const cum = metric === "cases" ? cumCases : cumDeaths;
  const series = useMemo(
    () => (mode === "cumulative" ? cum : cum.map((v, i) => (i === 0 ? v : Math.max(0, v - cum[i - 1])))),
    [cum, mode],
  );

  const colour = cssVar(metric === "cases" ? "--saline" : "--clot-lift");
  const maxV = Math.max(...series);
  const useLog = scale === "log";
  const minV = useLog ? Math.max(1, Math.min(...series.filter((v) => v > 0))) : 0;

  const sy = (v) => {
    if (useLog) {
      const l0 = Math.log10(minV), l1 = Math.log10(maxV);
      return MT + IH - ((Math.log10(Math.max(v, minV)) - l0) / (l1 - l0)) * IH;
    }
    return MT + IH - (v / maxV) * IH;
  };
  const sx = (i) => ML + (i / (series.length - 1)) * IW;

  const ticks = useMemo(() => {
    if (useLog) {
      const out = [];
      for (let p = Math.ceil(Math.log10(minV)); p <= Math.log10(maxV); p++) out.push(10 ** p);
      return out;
    }
    return [0, 1, 2, 3, 4].map((k) => (maxV * k) / 4);
  }, [useLog, minV, maxV]);

  const points = series.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`);
  const line = `M${points.join(" L")}`;
  const area = `${line} L${sx(series.length - 1)},${MT + IH} L${ML},${MT + IH} Z`;

  const onScrub = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    setScrub(Math.round(clamp((x - ML) / IW, 0, 1) * (months.length - 1)));
  };

  const idx = scrub === null ? months.length - 1 : scrub;
  const newThisMonth = idx === 0 ? cum[0] : cum[idx] - cum[idx - 1];

  return (
    <section id="timeline" aria-labelledby="time-t">
      <div className="wrap">
        <SectionHead
          id="time-t"
          kicker={`Monthly cumulative totals, ${monthLabel(months[0])} – ${monthLabel(months[months.length - 1])}`}
          title="Four waves, one line"
        >
          Drag across the chart to read any month. The shaded bands mark when each dominant
          variant took over — notice Omicron adds more cases in ten weeks than the whole of 2020.
        </SectionHead>

        <Reveal className="chart-shell">
          <div className="map-bar">
            <Segmented label="Chart measure" value={metric} onChange={setMetric}
              options={[{ value: "cases", label: "Cases" }, { value: "deaths", label: "Deaths" }]} />
            <Segmented label="Chart mode" value={mode} onChange={setMode}
              options={[{ value: "cumulative", label: "Cumulative" }, { value: "monthly", label: "New per month" }]} />
            <Segmented label="Axis scale" value={scale} onChange={setScale} style={{ marginLeft: "auto" }}
              options={[{ value: "linear", label: "Linear" }, { value: "log", label: "Log" }]} />
          </div>

          <div className="chart-body">
            <svg ref={svgRef} id="timechart" viewBox={`0 0 ${W} ${H}`} role="img"
                 aria-label="Timeline of global COVID-19 totals"
                 onPointerDown={onScrub}
                 onPointerMove={(e) => { if (e.buttons || e.pointerType === "mouse") onScrub(e); }}
                 onPointerLeave={() => setScrub(null)}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colour} stopOpacity=".34" />
                  <stop offset="100%" stopColor={colour} stopOpacity="0" />
                </linearGradient>
              </defs>

              <g className="axis">
                {ticks.map((t, i) => (
                  <g key={i}>
                    <line className="gridline" x1={ML} y1={sy(t)} x2={W - MR} y2={sy(t)} />
                    <text x={ML - 9} y={sy(t) + 3} textAnchor="end">{compact(t)}</text>
                  </g>
                ))}
              </g>

              {WAVES.map((w, i) => {
                const a = months.indexOf(w.from), b = months.indexOf(w.to);
                if (a < 0 || b < 0) return null;
                return (
                  <g className="wave-band" key={w.n}>
                    {i % 2 === 1 && <rect x={sx(a)} y={MT} width={sx(b) - sx(a)} height={IH} />}
                    <line x1={sx(a)} y1={MT} x2={sx(a)} y2={MT + IH} stroke="var(--hairline)" strokeWidth=".8" />
                    <text x={sx(a) + 5} y={MT - 8}>{w.n}</text>
                  </g>
                );
              })}

              {mode === "cumulative"
                ? <path d={area} fill="url(#ag)" />
                : series.map((v, i) => (
                    <rect key={i} x={sx(i) - (IW / series.length) * 0.34} y={sy(v)}
                          width={(IW / series.length) * 0.68} height={MT + IH - sy(v)}
                          fill={colour} fillOpacity=".38" />
                  ))}

              <path d={line} fill="none" stroke={colour} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

              <g className="axis">
                <line x1={ML} y1={MT + IH} x2={W - MR} y2={MT + IH} />
                {months.map((m, i) =>
                  m.endsWith("-01") || i === months.length - 1
                    ? <text key={m} x={sx(i)} y={H - 12} textAnchor="middle">{m.slice(0, 4)}</text>
                    : null)}
              </g>

              {scrub !== null && (
                <>
                  <line className="scrub-line" x1={sx(scrub)} y1={MT} x2={sx(scrub)} y2={MT + IH} />
                  <circle cx={sx(scrub)} cy={sy(series[scrub])} r="4.5" fill="var(--ink)" stroke={colour} strokeWidth="2" />
                </>
              )}
            </svg>
          </div>

          <div className="readout">
            <div><span className="k">Month</span><span className="v">{monthLabel(months[idx])}</span></div>
            <div>
              <span className="k">Cumulative {metric}</span>
              <span className="v" style={{ color: metric === "cases" ? "var(--saline)" : "var(--clot-lift)" }}>
                {fmt(cum[idx])}
              </span>
            </div>
            <div><span className="k">New that month</span><span className="v">{fmt(newThisMonth)}</span></div>
            <div>
              <span className="k">Share of the four-year total</span>
              <span className="v">{dec((cum[idx] / cum[cum.length - 1]) * 100, 1)}%</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
