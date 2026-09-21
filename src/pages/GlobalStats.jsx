import ScaleSection from "../sections/ScaleSection";
import TimelineSection from "../sections/TimelineSection";
import MapSection from "../sections/MapSection";

/** Kept as a standalone route so /global still resolves. */
export default function GlobalStats({ data, onOpenCountry }) {
  const { global, months, cumCases, cumDeaths, countries } = data;
  return (
    <div style={{ paddingTop: 62 }}>
      <ScaleSection global={global} cumCases={cumCases} cumDeaths={cumDeaths} />
      <TimelineSection months={months} cumCases={cumCases} cumDeaths={cumDeaths} />
      <MapSection countries={countries} onOpen={onOpenCountry} />
    </div>
  );
}
