import { useRef, useState } from "react";

const GROUP_SIZES = [4, 4, 4]; // 12 digits, grouped for readability

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

function tagClassFor(category) {
  return category === "Bumper Prize" ? "bumper" : "daily";
}

export default function CheckerPage({ data, loading, error, onNavigate }) {
  const [digits, setDigits] = useState(Array(12).fill(""));
  const [result, setResult] = useState(null); // null | { won: false } | { won: true, matches: [...] }
  const inputRefs = useRef([]);

  const couponNumber = digits.join("");
  const isComplete = digits.every((d) => d !== "");

  const latestDraw = data?.draws?.[0] ?? null;
  const totalDraws = data?.draws?.length ?? 0;
  const totalWinningCoupons =
    data?.draws?.reduce((sum, draw) => sum + draw.winners.length, 0) ?? 0;

  function handleChange(index, value) {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setResult(null);

    if (digit && index < 11) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(12).fill("");
    pasted
      .slice(0, 12)
      .split("")
      .forEach((d, i) => (next[i] = d));
    setDigits(next);
    setResult(null);
    const lastFilled = Math.min(pasted.length, 12) - 1;
    inputRefs.current[Math.max(lastFilled, 0)]?.focus();
  }

  function checkCoupon() {
    if (!data) return;

    const matches = [];
    for (const draw of data.draws) {
      for (const winner of draw.winners) {
        if (winner.c === couponNumber) {
          matches.push({ draw, winner });
        }
      }
    }

    setResult(matches.length > 0 ? { won: true, matches } : { won: false });
  }

  let groupStart = 0;

  return (
    <section>
      <div className="hero">
        <span className="eyebrow-badge">Independent — not affiliated with IRD</span>
        <h2 className="page-heading">Did your coupon win?</h2>
        <p className="page-subtext">
          Enter the 12-digit coupon from your bill or QR payment and check
          it against the published draw results.
        </p>
      </div>

      {!loading && !error && latestDraw && (
        <div className="highlight-card">
          <div className="highlight-card-header">
            <span className="highlight-card-eyebrow">Latest draw</span>
            <span className="highlight-card-category">
              {latestDraw.category}
            </span>
          </div>
          <p className="highlight-card-title">{latestDraw.title}</p>
          <p className="highlight-card-meta">
            Published {formatDateOnly(latestDraw.published)}
          </p>
          <div className="highlight-card-claim-row">
            <span
              className={`claim-status-chip ${
                latestDraw.open ? "open" : "closed"
              }`}
            >
              {latestDraw.open ? "Claim open" : "Claim closed"}
            </span>
            <span>
              {latestDraw.open
                ? `until ${formatDateOnly(latestDraw.deadline)}`
                : `closed ${formatDateOnly(latestDraw.deadline)}`}
            </span>
          </div>
          <button
            type="button"
            className="link-button"
            onClick={() => onNavigate?.("winners")}
          >
            View all winners →
          </button>
        </div>
      )}

      <div className="checker-card">
        <div className="digit-groups" onPaste={handlePaste}>
          {GROUP_SIZES.map((size, groupIndex) => {
            const start = groupStart;
            groupStart += size;
            return (
              <span key={groupIndex} style={{ display: "flex", gap: 6 }}>
                {groupIndex > 0 && <span className="digit-divider" />}
                <span className="digit-group">
                  {Array.from({ length: size }).map((_, i) => {
                    const index = start + i;
                    return (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="digit-box"
                        inputMode="numeric"
                        maxLength={1}
                        placeholder=" "
                        value={digits[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        aria-label={`Digit ${index + 1}`}
                      />
                    );
                  })}
                </span>
              </span>
            );
          })}
        </div>

        <button
          className="check-button"
          disabled={!isComplete || loading || !data}
          onClick={checkCoupon}
        >
          Check result
        </button>

        {loading && <p className="status-line">Loading current draws…</p>}
        {error && (
          <p className="status-line">
            Couldn't load current draws. Please try again shortly.
          </p>
        )}

        {result && result.won && (
          <div className="result won">
            <div className="result-heading-row">
              <h3 className="result-heading">This coupon has won</h3>
              <span
                className={`win-category-chip ${tagClassFor(
                  result.matches[0].draw.category
                )}`}
              >
                {result.matches[0].draw.category}
              </span>
            </div>
            {result.matches.map(({ draw, winner }, i) => (
              <div key={i}>
                <div className="result-detail-row">
                  <span className="result-detail-label">Draw</span>
                  <span>{draw.title}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Category</span>
                  <span>{draw.category}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Rank</span>
                  <span>#{winner.r}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Published</span>
                  <span>{formatDateOnly(draw.published)}</span>
                </div>
                <div className="result-detail-row">
                  <span className="result-detail-label">Claim deadline</span>
                  <span className="result-detail-value-with-chip">
                    <span
                      className={`claim-status-chip ${
                        draw.open ? "open" : "closed"
                      }`}
                    >
                      {draw.open ? "Open" : "Closed"}
                    </span>
                    {formatDateOnly(draw.deadline)}
                  </span>
                </div>
              </div>
            ))}
            <p className="result-note">
              This is an independent tool and not affiliated with IRD or the
              Government of Nepal — confirm your win and claim process on
              the official IRD site before taking any action.
            </p>
          </div>
        )}

        {result && !result.won && (
          <div className="result">
            <h3 className="result-heading">No match in current draws</h3>
            <p className="result-note">
              This number doesn't appear in the draws published so far. New
              draws are added regularly — check back after the next one.
            </p>
          </div>
        )}
      </div>

      {!loading && !error && data && (
        <div className="stats-strip">
          <div className="stat-item">
            <span className="stat-value">{totalDraws}</span>
            <span className="stat-label">Draws published</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalWinningCoupons}</span>
            <span className="stat-label">Winning coupons</span>
          </div>
        </div>
      )}

      <div className="how-it-works">
        <h3 className="how-it-works-heading">How this works</h3>
        <ol className="how-it-works-list">
          <li>
            After paying by cash bill or QR/digital payment, IRD issues a
            12-digit coupon number.
          </li>
          <li>
            IRD periodically publishes prize draws — Daily and Bumper
            Prizes — with winning coupon numbers.
          </li>
          <li>
            Enter your coupon number above to check it against every draw
            published so far.
          </li>
        </ol>
      </div>
    </section>
  );
}