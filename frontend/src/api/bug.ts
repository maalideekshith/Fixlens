import api from "./axios";

export interface Bug {
  id: number;
  user_id: number;
  title: string;
  description: string;
  severity: string | null;
  category: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  steps_to_reproduce: string | null;
  status: string;
  screenshot_url: string | null;

  ai_summary?: string | null;
  ai_root_cause?: string | null;
  ai_suggested_fix?: string | null;
  ai_severity?: string | null;
  ai_priority?: string | null;

  created_at: string;
  updated_at: string;
}

export interface BugCreate {
  title: string;
  description: string;
  severity?: string;
  category?: string;
  expected_behavior?: string;
  actual_behavior?: string;
  steps_to_reproduce?: string;
}

export const getBugs = async (): Promise<Bug[]> => {
  const token = localStorage.getItem("token");

  const response = await api.get<Bug[]>("/bugs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getBug = async (bugId: number): Promise<Bug> => {
  const token = localStorage.getItem("token");

  const response = await api.get<Bug>(`/bugs/${bugId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createBug = async (data: BugCreate): Promise<Bug> => {
  const token = localStorage.getItem("token");

  const response = await api.post<Bug>("/bugs", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteBug = async (bugId: number): Promise<void> => {
  const token = localStorage.getItem("token");

  await api.delete(`/bugs/${bugId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};