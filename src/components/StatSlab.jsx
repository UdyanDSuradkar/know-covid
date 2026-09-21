import useCountUp from "../hooks/useCountUp";
import { fmt } from "../utils/format";

function sparkPath(series) {
  const mx = Math.max(...series);
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * 100},${40 - (v / mx) * 38}`);
  return `M0,40 L${pts.join(" L")} L100,40 Z`;
}

export default function StatSlab({ label, value, sub, color, series, delay = 0 }) {
  const [ref, n] = useCountUp(value, 1600 + delay);
  const shown = n > 0 || value === 0;

  return (
    <div ref={ref} className={`slab ${shown ? "in" : ""}`} style={{ "--accent": color }}>
      {series && (
        <svg className="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path d={sparkPath(series)} fill={color} />
        </svg>
      )}
      <span className="k">{label}</span>
      <span className="v num">{fmt(n)}</span>
      <span className="s">{sub}</span>
    </div>
  );
}
