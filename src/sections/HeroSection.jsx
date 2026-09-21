import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, cssVar, fmt, monthLabel } from "../utils/format";
import useReducedMotion from "../hooks/useReducedMotion";

const DURATION = 12000;

/**
 * One dot = 1,000 confirmed deaths. The field ignites across the full
 * 2020–2023 series in twelve seconds, then drifts.
 */
export default function HeroSection({ months, cumCases, cumDeaths }) {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(null);
  const t0Ref = useRef(null);
  const playingRef = useRef(true);
  const visibleRef = useRef(true);
  const reduced = useReducedMotion();

  const [readout, setReadout] = useState({ deaths: 0, cases: 0, date: months[0], p: 0 });

  const buildDots = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const total = Math.round(cumDeaths[cumDeaths.length - 1] / 1000);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight;
    sizeRef.current = { w, h };
    cv.width = w * dpr; cv.height = h * dpr;
    cv.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(Math.sqrt(total * (w / h)));
    const rows = Math.ceil(total / cols);
    const gx = w / cols, gy = h / rows;
    const dots = [];
    for (let i = 0; i < total; i++) {
      const c = i % cols, r = (i / cols) | 0;
      dots.push({
        x: (c + 0.5) * gx + (Math.random() - 0.5) * gx * 0.78,
        y: (r + 0.5) * gy + (Math.random() - 0.5) * gy * 0.78,
        ph: Math.random() * Math.PI * 2,
        sp: 0.35 + Math.random() * 0.55,
        am: 0.5 + Math.random() * 1.4,
        k: Math.random(),
      });
    }
    dots.sort((a, b) => a.k - b.k); // random ignition order, even spatial fill
    dotsRef.current = dots;
  }, [cumDeaths]);

  const frame = useCallback((ts) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const { w, h } = sizeRef.current;
    if (t0Ref.current === null) t0Ref.current = ts;

    let p = clamp((ts - t0Ref.current) / DURATION, 0, 1);
    if (!playingRef.current) p = 1;

    const pos = p * (months.length - 1);
    const i = Math.floor(pos), f = pos - i, j = Math.min(i + 1, months.length - 1);
    const d = cumDeaths[i] + (cumDeaths[j] - cumDeaths[i]) * f;
    const c = cumCases[i] + (cumCases[j] - cumCases[i]) * f;
    setReadout({ deaths: d, cases: c, date: months[Math.round(pos)], p });

    const lit = cssVar("--clot-lift") || "#E0656E";
    const dim = cssVar("--hairline") || "#22303D";
    const litCount = d / 1000;
    const t = ts / 1000;
    const dots = dotsRef.current;

    ctx.clearRect(0, 0, w, h);
    for (let n = 0; n < dots.length; n++) {
      const dt = dots[n];
      const y = dt.y + Math.sin(t * dt.sp + dt.ph) * dt.am;
      const x = dt.x + Math.cos(t * dt.sp * 0.7 + dt.ph) * dt.am * 0.5;
      if (n < litCount) {
        const age = clamp((litCount - n) / 90, 0, 1);
        ctx.globalAlpha = 0.28 + age * 0.5;
        ctx.fillStyle = lit;
        ctx.beginPath();
        ctx.arc(x, y, 1.05 + (1 - age) * 1.5, 0, 6.283);
        ctx.fill();
      } else {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = dim;
        ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
      }
    }
    ctx.globalAlpha = 1;

    if (p >= 1) playingRef.current = false;
    if (visibleRef.current && !reduced) rafRef.current = requestAnimationFrame(frame);
  }, [months, cumCases, cumDeaths, reduced]);

  const start = useCallback(() => {
    t0Ref.current = null;
    playingRef.current = !reduced;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);
  }, [frame, reduced]);

  useEffect(() => {
    buildDots();
    start();
    const cv = canvasRef.current;
    const io = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      if (e.isIntersecting && !reduced) { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(frame); }
      else cancelAnimationFrame(rafRef.current);
    }, { threshold: 0 });
    if (cv) io.observe(cv);

    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { buildDots(); playingRef.current = false; frame(performance.now()); }, 180);
    };
    window.addEventListener("resize", onResize);
    const onTheme = () => frame(performance.now());
    window.addEventListener("kc:themechange", onTheme);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("kc:themechange", onTheme);
    };
  }, [buildDots, start, frame, reduced]);

  return (
    <section className="hero" aria-labelledby="h1">
      <canvas id="dotfield" ref={canvasRef} aria-hidden="true" />
      <div className="hero-veil" />
      <div className="hero-in">
        <div className="hero-grid">
          <div>
            <h1 className="display" id="h1">
              <span className="hero-line"><span>Because every</span></span>
              <span className="hero-line"><span>number is</span></span>
              <span className="hero-line"><span><em>a life.</em></span></span>
            </h1>
            <p className="lede hero-sub">
              Each point of light behind this text stands for one thousand people who died of
              COVID-19. Watch four years pass in twelve seconds.
            </p>
          </div>

          <div className="counter-card">
            <div className="lbl">
              <span>Confirmed deaths worldwide</span>
              <span>{monthLabel(readout.date)}</span>
            </div>
            <div className="big num">{fmt(readout.deaths)}</div>
            <div className="lbl">
              <span>Confirmed cases</span>
              <span className="num">{fmt(readout.cases)}</span>
            </div>
            <div className="tl-track"><div className="tl-fill" style={{ width: `${readout.p * 100}%` }} /></div>
            <div className="tl-year"><span>2020</span><span>2021</span><span>2022</span><span>2023</span></div>
            <button className="replay" onClick={() => { buildDots(); start(); }}>
              Replay the four years
            </button>
          </div>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true"><i />scroll</div>
    </section>
  );
}
