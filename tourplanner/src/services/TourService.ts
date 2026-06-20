import { api, API_URL } from "@/api/ApiClient";
import { TourRequest } from "@/types/api";

export const TourService = {
    getTours: async (): Promise<any> => {
        return api.get("/api/tours");
    },

    getTour: async (id: string): Promise<any> => {
        return api.get(`/api/tours/${id}`);
    },

    createTour: async (tour: TourRequest): Promise<any> => {
        return api.post("/api/tours", tour);
    },

    updateTour: async (id: string, tour: TourRequest): Promise<any> => {
        return api.put(`/api/tours/${id}`, tour);
    },

    deleteTour: async (id: string): Promise<any> => {
        return api.delete(`/api/tours/${id}`);
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
