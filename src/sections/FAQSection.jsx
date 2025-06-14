import React from "react";

function FAQSection() {
  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <details>
        <summary>What is COVID-19?</summary>
        <p>
          COVID-19 is a contagious disease caused by the coronavirus SARS-CoV-2.
        </p>
      </details>
      <details>
        <summary>How does it spread?</summary>
        <p>It spreads through respiratory droplets from an infected person.</p>
      </details>
    </section>
  );
}

export default FAQSection;
