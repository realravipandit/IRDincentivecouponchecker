export default function AboutPage() {
  return (
    <section>
      <div className="page-head">
        <h2 className="page-heading">About this tool</h2>
        <p className="page-subtext">
          A plain explanation of the coupon program and how this checker
          works.
        </p>
      </div>

      <div className="about-section">
        <h3>How coupons are generated</h3>
        <p>
          Every time you pay by cash bill or a QR/digital payment at a
          registered business, Nepal's Inland Revenue Department issues a
          12-digit coupon number tied to that purchase, as part of the
          Taxpayer Incentive Gift Program. These numbers are entered into
          periodic prize draws.
        </p>
      </div>

      <div className="about-section">
        <h3>Prize structure</h3>
        <p>
          Draws are grouped into two categories: Bumper Prizes, held less
          frequently with larger rewards, and Daily Prizes, drawn more
          often. Each draw covers a specific period and publishes a list of
          winning coupon numbers by rank.
        </p>
      </div>

      <div className="about-section">
        <h3>How to claim</h3>
        <p>
          If your coupon number matches a published winner, you'll need to
          claim it through IRD's official process before the listed
          deadline. This site only tells you whether your number matches —
          it doesn't handle claims, registration, or any personal
          information.
        </p>
      </div>

      <div className="disclaimer">
        This is an independent, unofficial tool. It is not affiliated with
        IRD or the Government of Nepal, and it doesn't register bills,
        collect personal data, or process prize claims. For official
        information and to make a claim, visit{" "}
        <a href="https://ird.gov.np" target="_blank" rel="noreferrer">
          ird.gov.np
        </a>
        .
      </div>
    </section>
  );
}