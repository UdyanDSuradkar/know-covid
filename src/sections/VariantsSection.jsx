import { useEffect, useRef, useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import FreshnessBadge from "../components/FreshnessBadge";
import { VARIANTS, SURVEILLANCE } from "../data/variants";

export default function VariantsSection() {
  const [grown, setGrown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setGrown(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const S = SURVEILLANCE;
  const stats = [
    ["New cases reported", S.newCases.toLocaleString(), null],
    ["New deaths reported", S.newDeaths.toLocaleString(), "var(--clot-lift)"],
    ["New hospital admissions", S.hospitalisations.toLocaleString(), null],
    ["New ICU admissions", S.icu.toLocaleString(), null],
    ["Test positivity, last 7 days", `${S.positivity}%`, null],
  ];

  return (
    <section id="variants" aria-labelledby="v-t">
      <div className="wrap">
        <SectionHead
          id="v-t"
          kicker="Share of sequences submitted to GISAID, week ending 16 August 2026"
          title="What is circulating now"
          badge={<FreshnessBadge asOf={S.asOf} label="Variant and surveillance figures" />}
        >
          The virus did not stop evolving when the dashboards went quiet. These are the lineages
          WHO currently tracks, and the share each held in the most recent reporting week.
        </SectionHead>

        <Reveal style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)", gap: "clamp(1.5rem,4vw,3rem)" }}>
          <div className="var-stack" ref={ref}>
            {VARIANTS.map((v, i) => {
              const delta = v.pct - v.prev;
              const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "–";
              return (
                <div className="var-row" key={v.name}>
                  <span className="vn">
                    {v.name}
                    {v.cls === "VOI" && <span className="tag voi" style={{ marginLeft: ".25rem" }}>VOI</span>}
                  </span>
                  <span className="vt">
                    <i className="vf"
                       style={{
                         background: v.color, display: "block",
                         width: grown ? `${v.pct}%` : 0,
                         transitionDelay: `${i * 70}ms`,
                       }} />
                  </span>
                  <span className="vp">
                    {v.pct}%{" "}
                    <span style={{ color: delta > 0 ? "var(--serum)" : "var(--muted)", fontSize: ".68rem" }}>
                      {arrow}{Math.abs(delta) || ""}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 14, background: "var(--ink-2)", padding: "1.2rem 1.3rem" }}>
              <h3>Surveillance in the last 28 days</h3>
              {stats.map(([k, v, colour], i) => (
                <div className="dstat" key={k} style={i === stats.length - 1 ? { borderBottom: 0 } : undefined}>
                  <span className="k">{k}</span>
                  <span className="v num" style={colour ? { color: colour } : undefined}>{v}</span>
                </div>
              ))}
              <p className="note" style={{ marginTop: ".9rem" }}>
                Reported by {S.reportingCountries} countries across four WHO regions, {S.periodLabel}.
                Most countries have folded COVID-19 into routine respiratory surveillance and no
                longer publish national case counts, so these totals describe reporting effort as
                much as disease.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
