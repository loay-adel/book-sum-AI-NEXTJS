// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const handleResponse = async (response) => {
  if (!response.ok) {
    let error = "An error occurred";
    try {
      const errorData = await response.json();
      error = errorData.message || `HTTP error! status: ${response.status}`;
    } catch (e) {
      error = `HTTP error! status: ${response.status}`;
    }
    throw new Error(error);
  }
  return response.json();
};

export const api = {
  // Get book summary by name
  getBookSummary: async (bookName, lang = "en") => {
    const response = await fetch(`${API_BASE}/api/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookName, lang }),
    });
    return handleResponse(response);
  },

  // Upload and summarize PDF
  uploadPDF: async (formData) => {
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });
    return handleResponse(response);
  },

  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE}/api/categories`);
    return handleResponse(response);
  },

  // Get books by category
  getCategoryBooks: async (categoryId) => {
    const response = await fetch(`${API_BASE}/api/categories/${categoryId}`);
    return handleResponse(response);
  },
};
