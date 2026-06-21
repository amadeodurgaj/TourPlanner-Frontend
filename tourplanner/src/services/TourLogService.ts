import { api, ApiError } from "@/api/ApiClient";
import type { TourLogRequest, ApiResponse, TourLog } from "@/types/api";

export const TourLogService = {
    getLogs: async (tourId: string): Promise<ApiResponse<TourLog[]>> => {
        try {
            return await api.get<ApiResponse<TourLog[]>>(`/api/tours/${tourId}/logs`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to load tour logs. Please try again later.');
        }
    },

    getLog: async (tourId: string, logId: string): Promise<ApiResponse<TourLog>> => {
        try {
            return await api.get<ApiResponse<TourLog>>(`/api/tours/${tourId}/logs/${logId}`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to load tour log. Please try again later.');
        }
    },

    createLog: async (tourId: string, log: TourLogRequest): Promise<ApiResponse<TourLog>> => {
        try {
            return await api.post<ApiResponse<TourLog>>(`/api/tours/${tourId}/logs`, log);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to create tour log. Please check your information and try again.');
        }
    },

    updateLog: async (tourId: string, logId: string, log: TourLogRequest): Promise<ApiResponse<TourLog>> => {
        try {
            return await api.put<ApiResponse<TourLog>>(`/api/tours/${tourId}/logs/${logId}`, log);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to update tour log. Please try again.');
        }
    },

    deleteLog: async (tourId: string, logId: string): Promise<ApiResponse<null>> => {
        try {
            return await api.delete<ApiResponse<null>>(`/api/tours/${tourId}/logs/${logId}`);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Failed to delete tour log. Please try again.');
        }
    }
};

export default TourLogService;
