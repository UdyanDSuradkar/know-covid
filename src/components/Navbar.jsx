import React, { useEffect, useState } from "react";
import { navLinks } from "../constants";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-30 transition-shadow ${
        scrolled ? "shadow-md bg-blue-900" : "bg-blue-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link className="text-xl font-bold text-white" to="/">
          Know Covid
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-1 w-6 bg-white rounded transition-all duration-300 mb-1 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-white rounded transition-all duration-300 mb-1 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-white rounded transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
        {/* Nav links */}
        <nav>
          <ul
            className={`flex flex-col md:flex-row md:gap-6 gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-900 md:bg-transparent px-4 md:px-0 py-4 md:py-0 z-20 transition-all duration-300 ${
              menuOpen ? "block" : "hidden"
            } md:flex`}
          >
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <Link
                  to={link}
                  className="block py-2 md:py-0 text-white hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{name}</span>
                </Link>
              </li>
            ))}
            <li className="group">
              <a
                href="#contact"
                className="block py-2 md:py-0 text-blue-200 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
