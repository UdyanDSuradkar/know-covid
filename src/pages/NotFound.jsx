import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/** 404 with a light particle drift, matching the hero's visual language. */
export default function NotFound() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const dots = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.clientWidth,
      y: Math.random() * cv.clientHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.6 + Math.random() * 1.4,
    }));
    let raf;
    const tick = () => {
      const w = cv.clientWidth, h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "80svh", display: "grid", placeItems: "center" }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true" />
      <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
        <h1 className="display" style={{ fontSize: "clamp(4rem,14vw,9rem)" }}>404</h1>
        <p className="lede" style={{ margin: "0 auto 1.6rem" }}>
          That page does not exist. The data, thankfully, still does.
        </p>
        <Link className="ghost-btn" to="/">Back to the observatory</Link>
      </div>
    </section>
  );
}
