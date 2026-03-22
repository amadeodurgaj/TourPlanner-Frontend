import { api } from "@/api/ApiClient";
import { TourRequest } from "@/types/api";

export const TourService = {
    getTours: async (username: string): Promise<any> => {
        return api.get(`/api/tours?username=${encodeURIComponent(username)}`);
    },

    getTour: async (id: string, username: string): Promise<any> => {
        return api.get(`/api/tours/${id}?username=${encodeURIComponent(username)}`);
    },

    createTour: async (tour: TourRequest, username: string): Promise<any> => {
        return api.post(`/api/tours?username=${encodeURIComponent(username)}`, tour);
    },

    updateTour: async (id: string, tour: TourRequest, username: string): Promise<any> => {
        return api.put(`/api/tours/${id}?username=${encodeURIComponent(username)}`, tour);
    },

    deleteTour: async (id: string, username: string): Promise<any> => {
        return api.delete(`/api/tours/${id}?username=${encodeURIComponent(username)}`);
    }
};

export default TourService;
