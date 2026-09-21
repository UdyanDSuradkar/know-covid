import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import { LAYERS } from "../data/layers";
import { cssVar } from "../utils/format";
import useReducedMotion from "../hooks/useReducedMotion";

export default function RiskSection() {
  const [on, setOn] = useState(() => Object.fromEntries(LAYERS.map((l) => [l.id, false])));
  const canvasRef = useRef(null);
  const partsRef = useRef([]);
  const rafRef = useRef(null);
  const onRef = useRef(on);
  const reduced = useReducedMotion();

  onRef.current = on;

  const risk = useMemo(
    () => LAYERS.reduce((acc, l) => (on[l.id] ? acc * (1 - l.r) : acc), 1),
    [on],
  );

  const colourFor = (v) =>
    v > 0.6 ? cssVar("--clot-lift") : v > 0.3 ? cssVar("--serum") : cssVar("--oxygen");

  const paint = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const flags = onRef.current;
    const active = (id) => flags[id];
    const W = cv.width, H = cv.height;
    const reach = LAYERS.reduce((acc, l) => (flags[l.id] ? acc * (1 - l.r) : acc), 1);
    const recvX = active("dist") ? W - 95 : W * 0.56;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = cssVar("--hairline");
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 30, W - 80, H - 60);
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillStyle = cssVar("--muted");
    ctx.fillText(active("vent") ? "ventilated room · air exchanging" : "enclosed room · air recirculating", 50, 22);
    if (active("time")) ctx.fillText("15 min", W - 92, 22);

    ctx.fillStyle = cssVar("--clot-lift");
    ctx.beginPath(); ctx.arc(120, H / 2, 13, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 0.18;
    ctx.beginPath(); ctx.arc(120, H / 2, active("mask") ? 18 : 30, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = cssVar("--muted");
    ctx.fillText("infectious", 92, H / 2 + 34);

    ctx.fillStyle = colourFor(reach);
    ctx.beginPath(); ctx.arc(recvX, H / 2, 13, 0, 6.283); ctx.fill();
    if (active("vax")) {
      ctx.strokeStyle = cssVar("--oxygen"); ctx.lineWidth = 1.6; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.arc(recvX, H / 2, 22, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (active("mask")) {
      ctx.strokeStyle = cssVar("--bone"); ctx.globalAlpha = 0.5; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(recvX - 9, H / 2, 9, -1.1, 1.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(129, H / 2, 9, 2.05, 4.24); ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = cssVar("--muted");
    ctx.fillText("you", recvX - 9, H / 2 + 34);
    if (active("dist")) {
      ctx.strokeStyle = cssVar("--hairline"); ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(140, H / 2 + 52); ctx.lineTo(recvX - 16, H / 2 + 52); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText("2 m", (140 + recvX) / 2 - 9, H / 2 + 68);
    }

    const parts = partsRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.004;
      p.life -= active("vent") ? 0.014 : 0.006;
      if (p.blocked === undefined) p.blocked = Math.random() > reach;
      if (p.blocked && p.x > recvX - 46) p.life -= 0.09;
      if (p.life <= 0 || p.x > W - 45 || p.y < 32 || p.y > H - 32) { parts.splice(i, 1); continue; }
      const hit = !p.blocked && Math.abs(p.x - recvX) < 13 && Math.abs(p.y - H / 2) < 15;
      ctx.globalAlpha = Math.max(0, p.life) * (p.blocked ? 0.3 : 0.75);
      ctx.fillStyle = hit ? colourFor(reach) : cssVar("--clot-lift");
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;

    const cap = active("mask") ? 55 : 130;
    if (parts.length < cap && Math.random() > (active("time") ? 0.55 : 0.12)) {
      for (let k = 0; k < 2; k++) {
        parts.push({
          x: 120 + (Math.random() - 0.5) * 10,
          y: H / 2 + (Math.random() - 0.5) * 10,
          vx: (0.9 + Math.random() * 1.5) * (active("mask") ? 0.45 : 1),
          vy: (Math.random() - 0.5) * 1.1 - (active("vent") ? 0.55 + Math.random() * 0.5 : 0),
          life: 1,
          r: 1 + Math.random() * 1.6,
        });
      }
    }
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const loop = () => { paint(); rafRef.current = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !rafRef.current && !reduced) loop();
      else if (!e.isIntersecting && rafRef.current) {
        cancelAnimationFrame(rafRef.current); rafRef.current = null;
      }
    }, { threshold: 0.15 });
    io.observe(cv);
    paint();

    const onTheme = () => paint();
    window.addEventListener("kc:themechange", onTheme);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("kc:themechange", onTheme);
    };
  }, [paint, reduced]);

  useEffect(() => { paint(); }, [on, paint]);

  const pct = risk * 100;
  const display = pct < 1 ? pct.toFixed(2) : pct.toFixed(pct < 10 ? 1 : 0);

  return (
    <section id="risk" aria-labelledby="r-t">
      <div className="wrap">
        <SectionHead
          id="r-t"
          kicker="An illustrative model, not a clinical prediction"
          title="Stack the protections"
        >
          No single measure works alone, and that was always the point. Turn each layer on and
          watch how the particles behave — protections multiply rather than add.
        </SectionHead>

        <Reveal className="risk-wrap">
          <div className="toggles">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                className="tgl"
                aria-pressed={on[l.id]}
                onClick={() => setOn((s) => ({ ...s, [l.id]: !s[l.id] }))}
              >
                <span className="sw" aria-hidden="true" />
                <span className="tx"><b>{l.n}</b><span>{l.s}</span></span>
                <span className="rd">−{Math.round(l.r * 100)}%</span>
              </button>
            ))}
          </div>

          <div className="risk-vis">
            <canvas ref={canvasRef} id="riskcanvas" width="720" height="420" aria-hidden="true" />
            <div className="risk-num">
              <span className="v num" style={{ color: colourFor(risk) }}>{display}%</span>
              <span className="l">of baseline transmission risk in a shared indoor hour</span>
            </div>
            <div className="risk-meter">
              <i style={{ width: `${Math.max(1.2, pct)}%`, background: colourFor(risk) }} />
            </div>
            <p className="note" style={{ marginTop: ".9rem" }}>
              Reductions are illustrative values drawn from the general direction of the published
              literature, combined multiplicatively. Real-world effect depends on fit, dose, timing
              and the variant in circulation.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
