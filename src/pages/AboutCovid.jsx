import SectionHead from "../components/SectionHead";
import SymptomsSection from "../sections/SymptomsSection";
import RiskSection from "../sections/RiskSection";
import FAQSection from "../sections/FAQSection";

export default function AboutCovid() {
  return (
    <div style={{ paddingTop: 62 }}>
      <section>
        <div className="wrap">
          <SectionHead kicker="Background" title="About COVID-19">
            COVID-19 is the illness caused by SARS-CoV-2, a coronavirus first identified at the
            end of 2019. It spreads mainly through the air — in aerosols and droplets that an
            infected person breathes out — which is why ventilation and respirator fit matter
            more than surface cleaning ever did.
          </SectionHead>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem" }}>
            <div>
              <h3>How it spreads</h3>
              <p className="note">
                Infectious particles linger in indoor air, concentrating in crowded, poorly
                ventilated spaces. Transmission risk rises with time spent in the room, the number
                of people in it, and how little the air is exchanged.
              </p>
            </div>
            <div>
              <h3>Who is most at risk</h3>
              <p className="note">
                Severity climbs sharply with age and with underlying conditions. In July 2026, 78%
                of reported deaths with age information occurred in people aged 65 and over.
              </p>
            </div>
            <div>
              <h3>What still works</h3>
              <p className="note">
                Up-to-date vaccination, a well-fitted respirator, clean indoor air, and staying
                home when symptomatic. None is sufficient alone; stacked, they compound.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SymptomsSection />
      <RiskSection />
      <FAQSection />
    </div>
  );
}
