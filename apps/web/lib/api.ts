export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`API responded ${res.status}`);
  return res.json();
}
