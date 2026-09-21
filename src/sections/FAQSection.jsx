import { useRef } from "react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import { FAQS } from "../data/faqs";

export default function FAQSection() {
  const listRef = useRef(null);

  // Accordion behaviour: opening one closes the rest.
  const onToggle = (e) => {
    if (!e.target.open) return;
    listRef.current?.querySelectorAll("details").forEach((d) => {
      if (d !== e.target) d.open = false;
    });
  };

  return (
    <section id="faq" aria-labelledby="f-t">
      <div className="wrap">
        <SectionHead id="f-t" kicker="Answers kept short on purpose" title="Questions people still ask" />
        <Reveal className="faq">
          <div ref={listRef}>
            {FAQS.map(([q, a]) => (
              <details key={q} onToggle={onToggle}>
                <summary>{q}<span className="pm" aria-hidden="true" /></summary>
                <div className="ans">{a}</div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
