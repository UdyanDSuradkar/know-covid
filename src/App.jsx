import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GlobalStats from "./pages/GlobalStats";
import CountryStats from "./pages/CountryStats";
import AboutCovid from "./pages/AboutCovid";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/global" element={<GlobalStats />} />
          <Route path="/country" element={<CountryStats />} />
          <Route path="/about" element={<AboutCovid />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
