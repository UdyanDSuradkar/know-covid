import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS, SECTION_IDS } from "../constants";
import useScrollSpy from "../hooks/useScrollSpy";

const MOON = <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />;
const SUN = (
  <>
    <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.7-6.7l-1.4 1.4M7.7 16.3l-1.4 1.4m12.4 0l-1.4-1.4M7.7 7.7L6.3 6.3" />
    <circle cx="12" cy="12" r="4" />
  </>
);

export default function Navbar({ theme, onToggleTheme, onOpenSearch }) {
  const [open, setOpen] = useState(false);
  const { progress, active, stuck } = useScrollSpy(SECTION_IDS);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`topbar ${stuck ? "stuck" : ""}`}>
      <div className="topbar-in">
        <Link className="brand" to="/"><b>Know Covid</b><span>observatory</span></Link>

        <nav>
          <ul className={`navlinks ${open ? "open" : ""}`} id="navlinks">
            {onHome
              ? NAV_LINKS.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.link}
                      aria-current={active === l.link.slice(1) ? "true" : undefined}
                      onClick={() => setOpen(false)}
                    >{l.name}</a>
                  </li>
                ))
              : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/global">Global stats</Link></li>
                  <li><Link to="/country">Country stats</Link></li>
                  <li><Link to="/about">About</Link></li>
                </>
              )}
          </ul>
        </nav>

        <div className="bar-tools">
          <button className="kbd-btn" onClick={onOpenSearch} aria-label="Find a country">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <span>Find a country</span><kbd>/</kbd>
          </button>

          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {theme === "dark" ? MOON : SUN}
            </svg>
          </button>

          <button
            className="burger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="navlinks"
            onClick={() => setOpen((o) => !o)}
          ><i /><i /><i /></button>
        </div>

        <div className="progress" style={{ width: `${progress * 100}%` }} />
      </div>
    </header>
  );
}
