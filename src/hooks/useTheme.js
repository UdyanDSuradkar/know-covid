import { useCallback, useEffect, useState } from "react";

const read = () => {
  try {
    const stored = localStorage.getItem("kc-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch { /* storage unavailable */ }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export default function useTheme() {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("kc-theme", theme); } catch { /* ignore */ }
    // Canvas and SVG read colours imperatively, so tell them the palette moved.
    window.dispatchEvent(new CustomEvent("kc:themechange", { detail: theme }));
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}
