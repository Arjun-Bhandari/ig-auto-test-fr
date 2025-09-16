export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function exchangeInstagramCode(code: string) {
  const response = await fetch(`${BACKEND_URL}/api/igauth/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Instagram code');
  }

  return response.json();
}

export async function getIgMedia (igUserId:string, limit:number){
  const response = await fetch(`${BACKEND_URL}/api/igmedia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ igUserId, limit }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to get Instagram media');
  }

  const data = await response.json();
  // Server returns shape: { data: IgMediaItem[], paging?: {...} }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}