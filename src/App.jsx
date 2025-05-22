import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";
import Hero from "./sections/Hero";
import Stats from "./components/stats"; // ✅ make sure this file exists
import NotFound from "./pages/NotFound"; // ✅ your custom 404

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
