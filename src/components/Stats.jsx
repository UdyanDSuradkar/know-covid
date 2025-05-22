import React, { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://disease.sh/v3/covid-19/all")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-white text-xl">
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">
          Global COVID-19 Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-yellow-400">
              Total Cases
            </h3>
            <p className="text-2xl font-bold">{data.cases.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-green-400">
              Recovered
            </h3>
            <p className="text-2xl font-bold">
              {data.recovered.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-red-400">Deaths</h3>
            <p className="text-2xl font-bold">{data.deaths.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-sm mt-6 text-gray-400">
          Last Updated: {new Date(data.updated).toLocaleString()}
        </p>
      </div>
    </section>
  );
};

export default Stats;
