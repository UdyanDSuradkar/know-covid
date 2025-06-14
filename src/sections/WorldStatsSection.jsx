import React from "react";
import useFetchData from "../hooks/useFetchData";
import { formatNumber } from "../utils/formatNumbers";

function WorldStatsSection() {
  const { data, loading, error } = useFetchData(
    "https://disease.sh/v3/covid-19/all"
  );

  if (loading) return <p>Loading world statistics...</p>;
  if (error) return <p>Error fetching data.</p>;

  return (
    <section className="world-stats">
      <h2>Global COVID-19 Statistics</h2>
      <div className="stats">
        <p>Total Cases: {formatNumber(data.cases)}</p>
        <p>Recovered: {formatNumber(data.recovered)}</p>
        <p>Deaths: {formatNumber(data.deaths)}</p>
      </div>
    </section>
  );
}

export default WorldStatsSection;
