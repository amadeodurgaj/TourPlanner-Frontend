import { useState, useCallback, useRef, useEffect } from 'react';
import { TourService } from '@/services/TourService';
import type { Tour } from '@/types/api';

interface SearchState {
    query: string;
    results: Tour[];
    isSearching: boolean;
    error: string | null;
}

interface SearchActions {
    setQuery: (query: string) => void;
    search: (query: string) => Promise<void>;
    clear: () => void;
}

export function useSearchViewModel(onResults?: (tours: Tour[]) => void): { state: SearchState; actions: SearchActions } {
    const [state, setState] = useState<SearchState>({
        query: '',
        results: [],
        isSearching: false,
        error: null,
    });

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            setState(prev => ({ ...prev, results: [], isSearching: false }));
            onResults?.([]);
            return;
        }

        try {
            setState(prev => ({ ...prev, isSearching: true, error: null }));
            const res = await TourService.searchTours(query);
            if (res.success) {
                setState(prev => ({ ...prev, results: res.data ?? [], isSearching: false }));
                onResults?.(res.data ?? []);
            } else {
                setState(prev => ({ ...prev, results: [], isSearching: false }));
                onResults?.([]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Search failed';
            setState(prev => ({ ...prev, isSearching: false, error: errorMessage || 'Search failed. Please try again with a different query.' }));
        }
    }, [onResults]);

    const setQuery = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            search(query);
        }, 300);
    }, [search]);

    const clear = useCallback(() => {
        setState({ query: '', results: [], isSearching: false, error: null });
        onResults?.([]);
    }, [onResults]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return {
        state,
        actions: { setQuery, search, clear },
    };
}
