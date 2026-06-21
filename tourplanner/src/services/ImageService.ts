import { API_URL } from '@/api/ApiClient';
import type { ApiResponse } from '@/types/api';

export const ImageService = {
    uploadTourImage: async (tourId: string, file: File): Promise<ApiResponse<string>> => {
        const formData = new FormData();
        formData.append('file', file);

        const csrfToken = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
        const headers: Record<string, string> = {};
        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken[2]);
        }

        const response = await fetch(`${API_URL}/api/tours/${tourId}/image`, {
            method: 'PUT',
            credentials: 'include',
            headers,
            body: formData,
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                const errorMessage = errorData.message || `Upload failed: ${response.statusText}`;
                throw new Error(errorMessage);
            } catch {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
        }
        return response.json() as Promise<ApiResponse<string>>;
    }
};

export default ImageService;
