import { useEffect, useRef, useState } from "react";

/** Adds the `in` class once the element scrolls into view. */
export default function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, shown]);

  return [ref, shown];
}
