import { API_URL } from '@/api/ApiClient';

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
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        return response.json();
    }
};

export default ImageService;
