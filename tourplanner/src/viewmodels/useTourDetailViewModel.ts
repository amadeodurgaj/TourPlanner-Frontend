import { useState, useCallback } from 'react';
import { TourService } from '@/services/TourService';
import { ImageService } from '@/services/ImageService';
import type { Tour, TourRequest } from '@/types/api';

interface TourDetailState {
    editing: boolean;
    uploading: boolean;
    downloading: boolean;
    error: string | null;
}

interface TourDetailActions {
    startEditing: () => void;
    stopEditing: () => void;
    updateTour: (id: string, data: TourRequest) => Promise<Tour | null>;
    uploadImage: (tourId: string, file: File) => Promise<string | null>;
    downloadReport: (tourId: string, tourName: string) => Promise<void>;
    clearError: () => void;
}

export function useTourDetailViewModel(): { state: TourDetailState; actions: TourDetailActions } {
    const [state, setState] = useState<TourDetailState>({
        editing: false,
        uploading: false,
        downloading: false,
        error: null,
    });

    const startEditing = useCallback(() => {
        setState(prev => ({ ...prev, editing: true }));
    }, []);

    const stopEditing = useCallback(() => {
        setState(prev => ({ ...prev, editing: false }));
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const updateTour = useCallback(async (id: string, data: TourRequest): Promise<Tour | null> => {
        try {
            const res = await TourService.updateTour(id, data);
            if (res.success && res.data) {
                setState(prev => ({ ...prev, editing: false, error: null }));
                return res.data;
            }
            const errorMessage = res.message || 'Failed to update tour';
            setState(prev => ({ ...prev, error: errorMessage }));
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update tour';
            setState(prev => ({ ...prev, error: errorMessage || 'Failed to update tour. Please try again.' }));
            return null;
        }
    }, []);

    const uploadImage = useCallback(async (tourId: string, file: File): Promise<string | null> => {
        setState(prev => ({ ...prev, uploading: true, error: null }));
        try {
            const response = await ImageService.uploadTourImage(tourId, file);
            if (response.success && response.data) {
                setState(prev => ({ ...prev, uploading: false }));
                return response.data;
            }
            const errorMessage = response.message || 'Upload failed';
            setState(prev => ({ ...prev, uploading: false, error: errorMessage }));
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setState(prev => ({ ...prev, uploading: false, error: errorMessage || 'Image upload failed. Please check the file size and format.' }));
            return null;
        }
    }, []);

    const downloadReport = useCallback(async (tourId: string, tourName: string) => {
        setState(prev => ({ ...prev, downloading: true, error: null }));
        try {
            await TourService.downloadReport(tourId, tourName);
            setState(prev => ({ ...prev, downloading: false }));
        } catch {
            setState(prev => ({ ...prev, downloading: false, error: 'Failed to download PDF report' }));
            setTimeout(() => {
                setState(prev => ({ ...prev, error: null }));
            }, 4000);
        }
    }, []);

    return {
        state,
        actions: { startEditing, stopEditing, updateTour, uploadImage, downloadReport, clearError },
    };
}
