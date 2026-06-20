import { api, ApiError } from "@/api/ApiClient";
import type { LocationSearchResult } from "@/types/api";

export const LocationService = {
    search: async (query: string): Promise<LocationSearchResult[]> => {
        if (query.trim().length < 2) {
            return [];
        }
        
        try {
            const response = await api.get<{ data: LocationSearchResult[] }>(
                `/api/locations/search?q=${encodeURIComponent(query)}`
            );
            return response.data || [];
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error('Location search failed. Please try again with a different query.');
        }
    }
};

export default LocationService;
