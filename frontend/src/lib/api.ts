const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('Backend is unavailable')
  }

  return response.json()
}
