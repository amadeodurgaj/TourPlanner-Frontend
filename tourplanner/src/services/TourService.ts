import { api, API_URL, ApiError } from "@/api/ApiClient";
import type { TourRequest, ApiResponse, Tour } from "@/types/api";

export const TourService = {
    getTours: async (): Promise<ApiResponse<Tour[]>> => {
        try {
            return await api.get<ApiResponse<Tour[]>>("/api/tours");
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to load tours. Please try again later.');
        }
    },

    getTour: async (id: string): Promise<ApiResponse<Tour>> => {
        try {
            return await api.get<ApiResponse<Tour>>(`/api/tours/${id}`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to load tour. Please try again later.');
        }
    },

    createTour: async (tour: TourRequest): Promise<ApiResponse<Tour>> => {
        try {
            return await api.post<ApiResponse<Tour>>("/api/tours", tour);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to create tour. Please check your information and try again.');
        }
    },

    updateTour: async (id: string, tour: TourRequest): Promise<ApiResponse<Tour>> => {
        try {
            return await api.put<ApiResponse<Tour>>(`/api/tours/${id}`, tour);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to update tour. Please try again.');
        }
    },

    deleteTour: async (id: string): Promise<ApiResponse<null>> => {
        try {
            return await api.delete<ApiResponse<null>>(`/api/tours/${id}`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to delete tour. Please try again.');
        }
    },

    searchTours: async (query: string): Promise<ApiResponse<Tour[]>> => {
        try {
            return await api.get<ApiResponse<Tour[]>>(`/api/tours/search?q=${encodeURIComponent(query)}`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Search failed. Please try again with a different query.');
        }
    },

    exportTours: async (): Promise<void> => {
        const response = await fetch(`${API_URL}/api/tours/export`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Export failed');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tours_export.json';
        a.click();
        window.URL.revokeObjectURL(url);
    },

    importTours: async (file: File): Promise<ApiResponse<number>> => {
        const text = await file.text();
        const response = await fetch(`${API_URL}/api/tours/import`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: text,
        });
        if (!response.ok) throw new Error('Import failed');
        return response.json();
    },

    downloadReport: async (id: string, tourName: string): Promise<void> => {
        const response = await fetch(`${API_URL}/api/tours/${id}/report`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('PDF download failed');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tour_${tourName.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

export default TourService;
