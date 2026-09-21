export default function CountryCard({ country: c, primary, secondary, index = 0, onOpen }) {
  const total = c.deaths + c.recovered + c.active || 1;
  return (
    <button
      className="ccard"
      onClick={() => onOpen(c)}
      style={{ animation: `fadeUp .5s ${Math.min(index * 24, 360)}ms cubic-bezier(.16,1,.3,1) both` }}
    >
      <span className="top">
        <span className="flag">{c.flag}</span>
        <span className="nm">{c.name}</span>
        <span className="cont">{c.continent.replace(" America", ". Am.")}</span>
      </span>
      <span className="metric num">{primary}</span>
      <span className="sub">{secondary}</span>
      <span className="ratio" aria-hidden="true">
        <i style={{ width: `${(c.recovered / total) * 100}%`, background: "var(--oxygen)" }} />
        <i style={{ width: `${(c.active / total) * 100}%`, background: "var(--saline)" }} />
        <i style={{ width: `${(c.deaths / total) * 100}%`, background: "var(--clot)" }} />
      </span>
    </button>
  );
}
