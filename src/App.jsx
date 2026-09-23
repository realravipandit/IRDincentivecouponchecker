import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import CheckerPage from "./components/CheckerPage.jsx";
import WinnersPage from "./components/WinnersPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import { fetchWinners } from "./api.js";

export default function App() {
  const [page, setPage] = useState(
    () => localStorage.getItem("page") || "checker"
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWinners()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);

  return (
    <div className="app">
      <Header page={page} onNavigate={setPage} />

      {page === "checker" && (
        <CheckerPage data={data} loading={loading} error={error} />
      )}
      {page === "winners" && (
        <WinnersPage data={data} loading={loading} error={error} />
      )}
      {page === "about" && <AboutPage />}

      <footer className="site-footer">
        Coupon Checker is an independent, unofficial tool --- not affiliated
        with IRD or the Government of Nepal.
      </footer>
    </div>
  );
}