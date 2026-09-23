import { useState, useEffect, useRef } from "react";
import { registerVisit } from "../api";

export default function Header({ page, onNavigate }) {
  const [visits, setVisits] = useState(null);
  const hasFired = useRef(false);

  const tabs = [
    { id: "checker", label: "Check coupon" },
    { id: "winners", label: "Winners" },
    { id: "about", label: "About" },
  ];

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    registerVisit()
      .then(setVisits)
      .catch(() => setVisits(null));
  }, []);

  return (
    <header className="site-header">
      <h1 className="site-title">Coupon Checker</h1>
      <nav className="site-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={page === tab.id ? "active" : ""}
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {visits !== null && (
        <span className="visit-counter">👁 {visits.toLocaleString()}</span>
      )}
    </header>
  );
}