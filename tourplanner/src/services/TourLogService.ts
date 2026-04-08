import { api } from "@/api/ApiClient";
import { TourLogRequest } from "@/types/api";

export const TourLogService = {
    getLogs: async (tourId: string): Promise<any> => {
        return api.get(`/api/tours/${tourId}/logs`);
    },

    getLog: async (tourId: string, logId: string): Promise<any> => {
        return api.get(`/api/tours/${tourId}/logs/${logId}`);
    },

    createLog: async (tourId: string, log: TourLogRequest): Promise<any> => {
        return api.post(`/api/tours/${tourId}/logs`, log);
    },

    updateLog: async (tourId: string, logId: string, log: TourLogRequest): Promise<any> => {
        return api.put(`/api/tours/${tourId}/logs/${logId}`, log);
    },

    deleteLog: async (tourId: string, logId: string): Promise<any> => {
        return api.delete(`/api/tours/${tourId}/logs/${logId}`);
    }
};

export default TourLogService;
