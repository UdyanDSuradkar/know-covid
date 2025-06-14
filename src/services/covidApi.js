export const fetchGlobalStats = async () => {
  const res = await fetch("https://disease.sh/v3/covid-19/all");
  return res.json();
};
