import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { TourService } from '@/services/TourService';
import type { Tour } from '@/types/api';

interface TourListState {
    tours: Tour[];
    selectedTour: Tour | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
}

interface TourListActions {
    loadTours: () => Promise<void>;
    selectTour: (tour: Tour | null) => void;
    deleteTour: (id: string) => Promise<void>;
    searchTours: (query: string) => Promise<void>;
    clearSearch: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useTourListViewModel(): { state: TourListState; actions: TourListActions } {
    const [state, setState] = useState<TourListState>({
        tours: [],
        selectedTour: null,
        loading: true,
        error: null,
        searchQuery: '',
    });

    const loadTours = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const res = await TourService.getTours();
            if (res.success) {
                setState(prev => ({ ...prev, tours: res.data ?? [], loading: false }));
            } else {
                setState(prev => ({ ...prev, tours: [], loading: false }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load tours';
            setState(prev => ({ ...prev, loading: false, error: errorMessage || 'Failed to load tours. Please try again later.' }));
        }
    }, []);

    const selectTour = useCallback((tour: Tour | null) => {
        setState(prev => ({ ...prev, selectedTour: tour }));
    }, []);

    const deleteTour = useCallback(async (id: string) => {
        if (!window.confirm("Delete this tour?")) {
            return;
        }

        try {
            await TourService.deleteTour(id);
            toast.success('Tour deleted');
            setState(prev => ({
                ...prev,
                tours: prev.tours.filter(t => t.id !== id),
                selectedTour: prev.selectedTour?.id === id ? null : prev.selectedTour,
                error: null,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete tour';
            toast.error(errorMessage || 'Failed to delete tour');
            setState(prev => ({ ...prev, error: errorMessage || 'Failed to delete tour. Please try again.' }));
        }
    }, []);

    const searchTours = useCallback(async (query: string) => {
        setState(prev => ({ ...prev, searchQuery: query }));
        if (!query.trim()) {
            await loadTours();
            return;
        }
        try {
            setState(prev => ({ ...prev, loading: true }));
            const res = await TourService.searchTours(query);
            if (res.success) {
                setState(prev => ({ ...prev, tours: res.data ?? [], loading: false }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Search failed';
            setState(prev => ({ ...prev, loading: false, error: errorMessage || 'Search failed. Please try again with a different query.' }));
        }
    }, [loadTours]);

    const clearSearch = useCallback(async () => {
        setState(prev => ({ ...prev, searchQuery: '' }));
        await loadTours();
    }, [loadTours]);

    const refresh = useCallback(async () => {
        await loadTours();
    }, [loadTours]);

    return {
        state,
        actions: { loadTours, selectTour, deleteTour, searchTours, clearSearch, refresh },
    };
}
