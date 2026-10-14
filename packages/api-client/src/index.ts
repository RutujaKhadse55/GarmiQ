export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health/`);
  return res.json();
}
