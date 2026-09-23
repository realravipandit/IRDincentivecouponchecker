const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetches the current winners snapshot from the backend.
 * Shape: { snapshotDate, source, draws: [{ id, category, title, from, to,
 *          published, deadline, open, winners: [{ r, c }] }] }
 */
export async function fetchWinners() {
  const res = await fetch(`${API_URL}/api/winners`);
  if (!res.ok) {
    throw new Error(`Backend responded ${res.status}`);
  }
  return res.json();
}

/**
 * Increments and returns the site's total visit count.
 * Call once per real page visit (not on every read).
 * Shape: { count: number }
 */
export async function registerVisit() {
  const res = await fetch(`${API_URL}/api/visits`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Backend responded ${res.status}`);
  }
  const data = await res.json();
  return data.count;
}

/**
 * Reads the current visit count without incrementing it.
 * Shape: { count: number }
 */
export async function fetchVisitCount() {
  const res = await fetch(`${API_URL}/api/visits`);
  if (!res.ok) {
    throw new Error(`Backend responded ${res.status}`);
  }
  const data = await res.json();
  return data.count;
}