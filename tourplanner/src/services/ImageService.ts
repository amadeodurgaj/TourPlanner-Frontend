import { API_URL, ApiError } from '@/api/ApiClient';

export const ImageService = {
    uploadTourImage: async (tourId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/tours/${tourId}/image`, {
            method: 'PUT',
            credentials: 'include',
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
        return response.json();
    }
};

export default ImageService;
