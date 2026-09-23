export default function Header({ page, onNavigate }) {
  const tabs = [
    { id: "checker", label: "Check coupon" },
    { id: "winners", label: "Winners" },
    { id: "about", label: "About" },
  ];

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
    </header>
  );
}