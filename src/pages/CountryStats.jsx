import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { formatNumber } from "../utils/formatNumbers";

function CountryStats() {
  const [country, setCountry] = useState("India");
  const { data, loading, error } = useFetchData(
    `https://disease.sh/v3/covid-19/countries/${country}`
  );

  return (
    <div className="country-stats-page">
      <h1>COVID-19 Country Statistics</h1>
      <select onChange={(e) => setCountry(e.target.value)} value={country}>
        {["India", "USA", "Brazil", "Russia", "UK", "France"].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {loading && <p>Loading data...</p>}
      {error && <p>Error fetching data for {country}</p>}

      {data && (
        <ul>
          <li>Country: {data.country}</li>
          <li>Total Cases: {formatNumber(data.cases)}</li>
          <li>Recovered: {formatNumber(data.recovered)}</li>
          <li>Deaths: {formatNumber(data.deaths)}</li>
          <li>Active Cases: {formatNumber(data.active)}</li>
          <li>Tests Done: {formatNumber(data.tests)}</li>
        </ul>
      )}
    </div>
  );
}

export default CountryStats;
