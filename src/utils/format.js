export const fmt = (n) => Math.round(n).toLocaleString("en-US");

export const compact = (n) => {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(a >= 1e12 ? 0 : 2).replace(/\.0+$/, "") + "bn";
  if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e8 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(a >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "k";
  return fmt(n);
};

export const dec = (n, d = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const monthLabel = (m) => {
  const [y, mo] = m.split("-");
  return `${MONTH_NAMES[+mo - 1]} ${y}`;
};

export const ordinal = (n) => {
  const v = n % 100;
  return ["th", "st", "nd", "rd"][(v - 20) % 10] || ["th", "st", "nd", "rd"][v] || "th";
};

/** Whole days between an ISO "YYYY-MM-DD" date and now, floored at 0. */
export const daysSince = (isoDate) => {
  const then = new Date(`${isoDate}T00:00:00Z`);
  return Math.max(0, Math.floor((Date.now() - then.getTime()) / 86400000));
};

export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** "var(--saline)" -> resolved hex/rgb */
export const resolveVar = (token) =>
  token.startsWith("var(") ? cssVar(token.slice(4, -1)) : token;
