import React from "react";
import useFetchData from "../hooks/useFetchData";
import { formatNumber } from "../utils/formatNumbers";

function GlobalStats() {
  const { data, loading, error } = useFetchData(
    "https://disease.sh/v3/covid-19/all"
  );

  if (loading) return <p>Loading global data...</p>;
  if (error) return <p>Error fetching global statistics.</p>;

  return (
    <div className="global-stats-page">
      <h1>Global COVID-19 Statistics</h1>
      <ul>
        <li>Total Cases: {formatNumber(data.cases)}</li>
        <li>Recovered: {formatNumber(data.recovered)}</li>
        <li>Deaths: {formatNumber(data.deaths)}</li>
        <li>Active Cases: {formatNumber(data.active)}</li>
        <li>Critical Cases: {formatNumber(data.critical)}</li>
      </ul>
    </div>
  );
}

export default GlobalStats;
