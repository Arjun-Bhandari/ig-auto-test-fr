


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


export async function goLiveSubscribe(igUserId: string, fields: string[] = ["comments", "messages"]) {
  const r = await fetch(`${BACKEND_URL}/api/webhooks/instagram/subscribe`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ igUserId, fields })
  });
  if (!r.ok) throw new Error('Failed to subscribe webhook');
  return r.json();
}



// Updated createAutomation function to match new schema
export async function createAutomation(input: {
  igUserId: string;
  mediaId: string;
  name: string;
  campaignType:string,
  rule: any;
  status?: string;
  isActive?: boolean;
}) {
  const r = await fetch(`${BACKEND_URL}/api/automation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error('Failed to create automation');
  return r.json();
}





export async function getAutomationById(automationId: string) {
  const r = await fetch(`${BACKEND_URL}/api/automation/${automationId}`, {
    cache: 'no-store',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!r.ok) throw new Error('Failed to get automation');
  return r.json();
}

// Function to update automation status
export async function updateAutomationStatus(automationId: string, status: string, isActive: boolean) {
  const r = await fetch(`${BACKEND_URL}/api/automation/${automationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, isActive })
  });
  if (!r.ok) throw new Error('Failed to update automation status');
  return r.json();
}

// Function to delete automation
export async function deleteAutomation(automationId: string) {
  const r = await fetch(`${BACKEND_URL}/api/automation/${automationId}`, {
    method: 'DELETE',
  });
  if (!r.ok) throw new Error('Failed to delete automation');
  return r.json();
}

// Function to update automation
export async function updateAutomation(automationId: string, updateData: any) {
  const r = await fetch(`${BACKEND_URL}/api/automation/${automationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!r.ok) throw new Error('Failed to update automation');
  return r.json();
}

export async function listAutomations(igUserId: string) {
  const r = await fetch(`${BACKEND_URL}/api/automation?igUserId=${igUserId}`, {
    cache: 'no-store',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!r.ok) throw new Error('Failed to list automations');
  return r.json();
}


export async function getIgUser (igUserId: string) {
  const response = await fetch(`${BACKEND_URL}/api/igauth/user`,{
    method:"POST",
    cache:"no-store",
    headers:{
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ igUserId })
  })
  if (!response.ok) throw new Error('Failed to get Instagram user');
  return response.json();
}
 