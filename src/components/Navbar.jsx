import React, { useEffect, useState } from "react";
import { navLinks } from "../constants";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <Link className="logo" to="/">
          Know Covid
        </Link>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <Link to={link}>
                  <span>{name}</span>
                  <span className="underline"></span>
                </Link>
              </li>
            ))}
            {/* Extra nav link to /stats */}
            {/* <li className="group">
              <Link to="/stats">
                <span>Statistics</span>
                <span className="underline"></span>
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Optional: keep as anchor scroll */}
        <a href="#contact" className="contact-btn group">
          <div className="inner">
            <span>Contact</span>
          </div>
        </a>
      </div>
    </header>
  );
};

export default NavBar;
