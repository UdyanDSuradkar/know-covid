import React from "react";
import { symptoms } from "../data/symptoms";

function SymptomsSection() {
  return (
    <section className="symptoms-section">
      <h2>Common Symptoms</h2>
      <ul>
        {symptoms.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </section>
  );
}

export default SymptomsSection;
