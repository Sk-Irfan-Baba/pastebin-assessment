import axios from "axios";

// Automatically uses Vercel URL in prod, or localhost in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createPaste = async (content, ttl, maxViews) => {
  try {
    // Only send fields if they have values (filters out empty strings/zeros)
    const payload = { content };
    if (ttl) payload.ttl_seconds = parseInt(ttl);
    if (maxViews) payload.max_views = parseInt(maxViews);

    const response = await api.post("/api/pastes", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to create paste";
  }
};

export const getPaste = async (id) => {
  try {
    const response = await api.get(`/api/pastes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to fetch paste";
  }
};
