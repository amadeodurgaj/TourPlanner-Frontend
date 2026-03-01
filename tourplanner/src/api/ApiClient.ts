const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const apiGet = async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error("API request failed");
    }

    return response.json();
};