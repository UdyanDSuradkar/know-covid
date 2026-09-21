import SectionHead from "../components/SectionHead";
import StatSlab from "../components/StatSlab";

export default function ScaleSection({ global, cumCases, cumDeaths }) {
  const slabs = [
    { label: "Confirmed cases",  value: global.cases,  color: "var(--saline)",    series: cumCases,
      sub: "Reported to WHO since 31 December 2019" },
    { label: "Confirmed deaths", value: global.deaths, color: "var(--clot-lift)", series: cumDeaths,
      sub: `About 1 in every ${Math.round(global.population / global.deaths / 100) * 100} people alive today` },
    { label: "Vaccine doses",    value: global.vaxDoses, color: "var(--serum)",
      sub: `Roughly ${Math.round((global.vaxDoses / global.population) * 100)} doses for every 100 people` },
    { label: "Estimated excess deaths", value: global.excessLow, color: "var(--oxygen)",
      sub: "WHO estimate for 2020–2021 alone, against 5.4M reported" },
  ];

  return (
    <section id="scale" aria-labelledby="scale-t">
      <div className="wrap">
        <SectionHead
          id="scale-t"
          kicker="Cumulative totals reported to WHO, 2020–2024"
          title="The shape of four years"
        >
          Reported figures are a floor, not a ceiling. Testing collapsed after 2022 and many
          deaths were never attributed, so the true toll is understood to be several times
          higher than what appears below.
        </SectionHead>
      </div>
      <div className="wrap">
        <div className="slabs">
          {slabs.map((s, i) => <StatSlab key={s.label} {...s} delay={i * 120} />)}
        </div>
      </div>
    </section>
  );
}
