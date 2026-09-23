import { useMemo, useState } from "react";

function formatSnapshot(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;

  const datePart = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart}  ${timePart}`;
}

// Handles both a bare "YYYY-MM-DD" date and a full ISO timestamp like
// "2026-08-07T09:26:52.925863+05:45". A bare date is parsed manually
// (as a local date) to avoid the UTC-midnight day-shift bug; a full
// timestamp already carries its own offset, so the Date constructor
// parses it correctly on its own.
function formatDateOnly(dateStr) {
  if (!dateStr) return null;

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  let d;

  if (isDateOnly) {
    const [year, month, day] = dateStr.split("-").map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(dateStr);
  }

  if (isNaN(d)) return dateStr;

    return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// IRD's draw.title comes back as boilerplate like:
//   "Bumper Winner Consumer Selection for the period of Shrawan 1 to 15"
//   "Bumper Winner Consumer Selection for the period of Bhadra 16 to 31 (Sept 1 to 16)"
// The category ("Bumper"/"Daily") is already shown separately via the tag
// badge, so strip everything through "for the period of" and tighten
// "N to N" ranges into "N–N". Falls back to the raw title if it doesn't
// match the expected pattern.
function formatDrawTitle(title) {
  if (!title) return title;

  const stripped = title.replace(/^.*?for the period of\s*/i, "");
  const tightened = stripped.replace(/(\d+)\s+to\s+(\d+)/g, "$1–$2");

  return tightened || title;
}

function tagClassFor(category) {
  return category === "Bumper Prize" ? "bumper" : "daily";
}

export default function WinnersPage({ data, loading, error }) {
  const [filter, setFilter] = useState("all");

  const categories = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.draws.map((d) => d.category))];
  }, [data]);

  const visibleDraws = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.draws;
    return data.draws.filter((d) => d.category === filter);
  }, [data, filter]);

  const snapshotLabel = formatSnapshot(data?.snapshotDate);

  return (
    <section>
      <div className="page-head">
        <h2 className="page-heading">Recent winners</h2>
        <p className="page-subtext">
          Every draw in this snapshot, most recent first. Coupon numbers are
          exactly as published.
        </p>
      </div>

      {loading && <p className="status-line">Loading draws...</p>}
      {error && (
        <p className="status-line">
          Couldn't load draws. Please try again shortly.
        </p>
      )}

      {data && (
        <>
          <div className="filter-row">
            <button
              className={`filter-chip ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All draws
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {visibleDraws.map((draw) => (
            <div key={draw.id} className="draw-card">
              <div className="draw-card-top">
                <div>
                  <span className={`draw-tag ${tagClassFor(draw.category)}`}>
                    {draw.category}
                  </span>
                  <h3 className="draw-title">{formatDrawTitle(draw.title)}</h3>
                  <div className="draw-meta">
                    Published {formatDateOnly(draw.published)} -{" "}
                    {draw.winners.length} winner
                    {draw.winners.length > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="draw-status">
                  <div className={draw.open ? "status-open" : "status-closed"}>
                    {draw.open ? "Claim open" : "Claim closed"}
                  </div>
                  <div className="draw-status-date">
                    {draw.open
                      ? `until ${formatDateOnly(draw.deadline)}`
                      : `closed ${formatDateOnly(draw.deadline)}`}
                  </div>
                </div>
              </div>
              <div className="winner-chips">
                {draw.winners.map((w, i) => (
                  <span key={i} className="winner-chip">
                    <span className="winner-chip-rank">#{w.r}</span>
                    {w.c}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {snapshotLabel && (
            <p className="archive-note">
              Snapshot captured {snapshotLabel}. Older or newer draws may
              exist on the official site.
            </p>
          )}
        </>
      )}
    </section>
  );
}