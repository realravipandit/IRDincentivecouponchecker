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
