import { Link } from "react-router-dom";

export default function Footer({ status, updated }) {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link className="brand" to="/" style={{ marginBottom: ".8rem" }}>
              <b>Know Covid</b><span>observatory</span>
            </Link>
            <p className="note">
              A data instrument built to make four years of global figures legible. Nothing here
              is medical advice; for anything about your own health, talk to a clinician.
            </p>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>
              <li><a href="/#scale">Scale</a></li>
              <li><a href="/#map">Map</a></li>
              <li><a href="/#timeline">Timeline</a></li>
              <li><a href="/#countries">Countries</a></li>
            </ul>
          </div>
          <div>
            <h4>Pages</h4>
            <ul>
              <li><Link to="/global">Global stats</Link></li>
              <li><Link to="/country">Country stats</Link></li>
              <li><Link to="/about">About COVID-19</Link></li>
            </ul>
          </div>
          <div>
            <h4>Sources</h4>
            <ul>
              <li><a href="https://data.who.int/dashboards/covid19/summary" target="_blank" rel="noopener noreferrer">WHO dashboard</a></li>
              <li><a href="https://disease.sh/" target="_blank" rel="noopener noreferrer">disease.sh API</a></li>
              <li><a href="https://ourworldindata.org/coronavirus" target="_blank" rel="noopener noreferrer">Our World in Data</a></li>
            </ul>
          </div>
        </div>
        <div className="fbot">
          <span>
            {status === "live"
              ? `Live from disease.sh${updated ? `, updated ${updated.toLocaleString()}` : ""}.`
              : "Live API unreachable — showing the bundled snapshot."}{" "}
            Surveillance figures are WHO, 3–30 August 2026.
          </span>
          <span className="num">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
