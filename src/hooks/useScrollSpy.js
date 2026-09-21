import { useEffect, useState } from "react";

/** Returns scroll progress 0-1 and the id of the section currently in view. */
export default function useScrollSpy(ids) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? y / h : 0);
      setStuck(y > 12);
      let cur = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return { progress, active, stuck };
}
