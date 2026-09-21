import { useEffect, useRef, useState } from "react";
import { easeOutCubic, clamp } from "../utils/format";

const REDUCED = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Counts from 0 to `target` the first time the element is visible. */
export default function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED()) { setValue(target); return; }

    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = clamp((now - t0) / duration, 0, 1);
        setValue(target * easeOutCubic(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  return [ref, value];
}
