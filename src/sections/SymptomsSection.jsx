import { useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import { SYMPTOMS, BODY_PARTS } from "../data/symptoms";

const SILHOUETTE = "M100 70 q-9 0-11 8 l-22 9 q-11 5-13 17 l-7 52 q-1 9 7 11 q8 2 10-7 l7-38 l3 62 q-1 8 1 16 l9 76 q2 10 12 9 q9-1 9-11 l-1-72 h6 l-1 72 q0 10 9 11 q10 1 12-9 l9-76 q2-8 1-16 l3-62 l7 38 q2 9 10 7 q8-2 7-11 l-7-52 q-2-12-13-17 l-22-9 q-2-8-11-8 z";

export default function SymptomsSection() {
  const [active, setActive] = useState(null);

  return (
    <section id="symptoms" aria-labelledby="s-t">
      <div className="wrap">
        <SectionHead
          id="s-t"
          kicker="Frequency among symptomatic infections · select a symptom or a marker"
          title="How it presents"
        >
          Symptoms vary by variant, by vaccination status and by age. Omicron-era infections skew
          towards the upper airway: sore throat and congestion overtook the loss of smell that
          defined 2020.
        </SectionHead>

        <Reveal className="body-wrap">
          <div>
            <svg id="figure" viewBox="0 0 200 400" role="img" aria-label="Body diagram with symptom markers">
              <g>
                <circle className="silhouette" cx="100" cy="40" r="27" />
                <path className="silhouette" d={SILHOUETTE} />
              </g>
              {Object.entries(BODY_PARTS).map(([part, p]) => (
                <g key={part}
                   className={`hotspot ${active === part ? "on" : ""}`}
                   tabIndex={0} role="button" aria-label={part}
                   onPointerOver={() => setActive(part)}
                   onClick={() => setActive(part)}
                   onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(part); } }}>
                  <circle className="ring" cx={p.x} cy={p.y} r="9" />
                  <circle className="hs" cx={p.x} cy={p.y} r="6.5" />
                </g>
              ))}
            </svg>
            <p className="note" style={{ textAlign: "center", marginTop: ".8rem" }}>
              Markers are illustrative, not diagnostic.
            </p>
          </div>

          <div>
            <div className="sym-list">
              {SYMPTOMS.map((s, i) => (
                <button
                  key={s.n}
                  className={`sym ${s.urgent ? "urgent" : ""} ${active === s.part ? "on" : ""}`}
                  onPointerOver={() => setActive(s.part)}
                  onClick={() => setActive(s.part)}
                >
                  <span className="ix num">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="nm">{s.n}</span>
                    <span className="de">{s.d}</span>
                  </span>
                  <span className="pc num">{s.p}</span>
                </button>
              ))}
            </div>

            <div className="urgent-box">
              <h3>Seek emergency care immediately for</h3>
              <ul>
                <li>Trouble breathing, or breathlessness at rest</li>
                <li>Persistent pain or pressure in the chest</li>
                <li>New confusion, or difficulty staying awake</li>
                <li>Pale, grey or blue-tinted skin, lips or nail beds</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
