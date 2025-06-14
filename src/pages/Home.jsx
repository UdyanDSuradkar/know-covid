import React from "react";
import HeroSection from "../sections/HeroSection";
import WorldStatsSection from "../sections/WorldStatsSection";
import SymptomsSection from "../sections/SymptomsSection";
import PreventionSection from "../sections/PreventionSection";
import FAQSection from "../sections/FAQSection";

function Home() {
  return (
    <>
      <HeroSection />
      <WorldStatsSection />
      <SymptomsSection />
      <PreventionSection />
      <FAQSection />
    </>
  );
}

export default Home;
