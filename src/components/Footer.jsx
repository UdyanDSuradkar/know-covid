import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} COVID-19 Tracker. All rights reserved.</p>
      <p>
        Data sourced from{" "}
        <a href="https://disease.sh/" target="_blank" rel="noopener noreferrer">
          disease.sh
        </a>
      </p>
    </footer>
  );
}

export default Footer;
