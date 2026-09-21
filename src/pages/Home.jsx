import HeroSection from "../sections/HeroSection";
import ScaleSection from "../sections/ScaleSection";
import MapSection from "../sections/MapSection";
import TimelineSection from "../sections/TimelineSection";
import ExplorerSection from "../sections/ExplorerSection";
import CompareSection from "../sections/CompareSection";
import VariantsSection from "../sections/VariantsSection";
import SymptomsSection from "../sections/SymptomsSection";
import RiskSection from "../sections/RiskSection";
import FAQSection from "../sections/FAQSection";
import Ticker from "../components/Ticker";

export default function Home({ data, onOpenCountry }) {
  const { countries, global, months, cumCases, cumDeaths } = data;
  return (
    <>
      <HeroSection months={months} cumCases={cumCases} cumDeaths={cumDeaths} />
      <Ticker global={global} />
      <ScaleSection global={global} cumCases={cumCases} cumDeaths={cumDeaths} />
      <MapSection countries={countries} onOpen={onOpenCountry} />
      <TimelineSection months={months} cumCases={cumCases} cumDeaths={cumDeaths} />
      <ExplorerSection countries={countries} onOpen={onOpenCountry} />
      <CompareSection countries={countries} />
      <VariantsSection />
      <SymptomsSection />
      <RiskSection />
      <FAQSection />
    </>
  );
}
