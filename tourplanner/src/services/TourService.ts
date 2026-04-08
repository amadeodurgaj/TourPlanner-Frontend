import { api } from "@/api/ApiClient";
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
    }
};

export default TourService;
