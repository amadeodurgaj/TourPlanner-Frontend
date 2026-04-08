import { api } from "@/api/ApiClient";
import type { LocationSearchResult } from "@/types/api";

export const LocationService = {
    search: async (query: string): Promise<LocationSearchResult[]> => {
        if (query.trim().length < 2) {
            return [];
        }
        
        const response = await api.get(
            `/api/locations/search?q=${encodeURIComponent(query)}`
        );
        return response.data || [];
    }
};

export default LocationService;
