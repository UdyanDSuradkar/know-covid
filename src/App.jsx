import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CountryDrawer from "./components/CountryDrawer";
import CommandPalette from "./components/CommandPalette";

import Home from "./pages/Home";
import GlobalStats from "./pages/GlobalStats";
import CountryStats from "./pages/CountryStats";
import AboutCovid from "./pages/AboutCovid";
import NotFound from "./pages/NotFound";

import useCovidData from "./hooks/useCovidData";
import useTheme from "./hooks/useTheme";

export default function App() {
  const data = useCovidData();
  const { theme, toggle } = useTheme();
  const [country, setCountry] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openCountry = useCallback((c) => setCountry(c), []);
  const closeCountry = useCallback(() => setCountry(null), []);

  // "/" or ⌘K opens the palette, unless the user is typing.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if (typing) return;
      if (e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pageProps = { data, onOpenCountry: openCountry };

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggle} onOpenSearch={() => setPaletteOpen(true)} />

      <main id="top">
        <Routes>
          <Route path="/" element={<Home {...pageProps} />} />
          <Route path="/global" element={<GlobalStats {...pageProps} />} />
          <Route path="/country" element={<CountryStats {...pageProps} />} />
          <Route path="/about" element={<AboutCovid />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer status={data.status} updated={data.updated} />

      <CountryDrawer country={country} countries={data.countries} onClose={closeCountry} />
      <CommandPalette
        open={paletteOpen}
        countries={data.countries}
        onClose={() => setPaletteOpen(false)}
        onPick={openCountry}
      />
    </BrowserRouter>
  );
}
