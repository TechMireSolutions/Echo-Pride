const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5005/api').replace(/\/$/, '');

// Products fetch karne ki function
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error - Fetch Products:", error);
    throw error;
  }
};
