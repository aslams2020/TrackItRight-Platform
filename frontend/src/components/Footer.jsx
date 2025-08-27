
import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} TrackItRight. All rights reserved.</p>
      <p>Made with⚡by Aslam</p>
      <p className="footer-links">
        <a href="https://www.linkedin.com/in/aslamsayyad02/">LinkedIn</a> |{" "}
        <a href="https://github.com/aslams2020">GitHub</a>
      </p>
    </footer>
  );
}
