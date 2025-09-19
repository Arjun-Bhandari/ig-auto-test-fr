


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

export async function listAutomationPresets() {
  const r = await fetch(`${BACKEND_URL}/api/automation-presets`, { cache: 'no-store' ,headers:{
    'ngrok-skip-browser-warning': 'true'
  }});
  if (!r.ok) throw new Error('Failed to load presets');
  return r.json(); // { presets: Array<{id,label,description,type}> }
}

export async function createTemplate(input: {
  name: string; type: "comment-reply" | "comment-reply+dm"; body: any;
}) {
  const r = await fetch(`${BACKEND_URL}/api/templates`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error('Failed to create template');
  return r.json(); // { success, data:{ id, ... } }
}

export async function createAutomation(input: {
  igUserId: string; mediaId: string; templateId: string;
  randomize?: boolean; responses?: string[]; rule: any;
}) {
  const r = await fetch(`${BACKEND_URL}/api/automation-rules`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error('Failed to create automation');
  return r.json();
}

export async function listAutomations(igUserId: string) {
  const r = await fetch(`${BACKEND_URL}/api/automation-rules?igUserId=${encodeURIComponent(igUserId)}`, { cache:'no-store' ,
  headers:{
    'ngrok-skip-browser-warning': 'true'
  }});
  if (!r.ok) throw new Error('Failed to load automations');
  return r.json(); // { success, data: AutomationRecord[] }
}

export async function goLiveSubscribe(igUserId: string, fields: string[] = ["comments", "messages"]) {
  const r = await fetch(`${BACKEND_URL}/api/webhooks/instagram/subscribe`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ igUserId, fields })
  });
  if (!r.ok) throw new Error('Failed to subscribe webhook');
  return r.json();
}