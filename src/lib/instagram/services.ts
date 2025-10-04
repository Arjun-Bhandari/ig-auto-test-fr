
import {api} from "./api"
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function exchangeInstagramCode(code: string) {
  const response = await api.post(`${BACKEND_URL}/comment-automation/connected-accounts/instagram/callback`, {code:code});

  if (response.status !== 200) {
    throw new Error("Failed to exchange Instagram code");
  }

  return response
}

export async function getIgUser() {
    const response = await api.get(`${BACKEND_URL}/comment-automation/connected-accounts/instagram`,);
    if (response.status !== 200) throw new Error("Failed to List Automation");
    return response.data.data.connectedSocials[0];
  }

export async function getIgMedia(limit: number) {
  const response = await api.get(`${BACKEND_URL}/comment-automation/connected-accounts/instagram/media?limit=${limit}` );

  if (response.status != 200) {
    throw new Error("Failed to get Instagram media");
  }
  const data = await response.data.media.data
  
  // Server returns shape: { data: IgMediaItem[], paging?: {...} }
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}



// Updated createAutomation function to match new schema
export async function createAutomation(input: {
  mediaId: string;
  name: string;
  campaignType: string;
  rule: any;
  status?: string;
  isActive?: boolean;
}) {
  const r = await api.post(`${BACKEND_URL}/comment-automation/automation`, input);
  // if (r.status !== 200) throw new Error("Failed to create automation");
console.log("Response", r.data.data)
  return r.data.data;
}
// List all the automation for the user
export async function listAutomations() {
    const r = await api.get(`${BACKEND_URL}/comment-automation/automation`);
    if (r.status !== 200) throw new Error("Failed to List Automation");
    return r;
  }

// Get automation by automation Id
export async function getAutomationById(automationId: string) {
  const r = await api.get(`${BACKEND_URL}/comment-automation/automation/${automationId}`);
  if (r.status !== 200) throw new Error("Failed to get automation");
  return r;
}


// Function to update automation status
export async function updateAutomationStatus(input:{
    status: string,
    isActive: boolean
},
automationId:string,
) {
  const r = await api.patch(
    `${BACKEND_URL}/comment-automation/automation/${automationId}/status`,input
  );
  if (r.status !== 2000) throw new Error("Failed to update automation status");
  return r;
}

// Function to update automation
export async function updateAutomation(automationId: string, updateData: any) {
    const r = await api.put(`${BACKEND_URL}/comment-automation/automation/${automationId}`,updateData);
    if (r.status !== 200) throw new Error("Failed to update data");
    return r;
  }

// Function to delete automation
export async function deleteAutomation(automationId: string) {
  const r = await api.delete(`${BACKEND_URL}/comment-automation/automation/${automationId}`);
  if (r.status !== 200) throw new Error("Failed to delete automation");
  return r;
}





