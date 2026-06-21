import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { TourLogService } from '@/services/TourLogService';
import type { TourLog, TourLogRequest } from '@/types/api';

interface TourLogState {
    logs: TourLog[];
    loading: boolean;
    error: string | null;
    dialogOpen: boolean;
    editingLog: TourLog | null;
}

interface TourLogActions {
    loadLogs: (tourId: string) => Promise<void>;
    createLog: (tourId: string, data: TourLogRequest) => Promise<boolean>;
    updateLog: (tourId: string, logId: string, data: TourLogRequest) => Promise<boolean>;
    deleteLog: (tourId: string, logId: string) => Promise<boolean>;
    openCreateDialog: () => void;
    openEditDialog: (log: TourLog) => void;
    closeDialog: () => void;
}

export function useTourLogViewModel(): { state: TourLogState; actions: TourLogActions } {
    const [state, setState] = useState<TourLogState>({
        logs: [],
        loading: false,
        error: null,
        dialogOpen: false,
        editingLog: null,
    });

    const loadLogs = useCallback(async (tourId: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const res = await TourLogService.getLogs(tourId);
            if (res.success) {
                setState(prev => ({ ...prev, logs: res.data ?? [], loading: false }));
            } else {
                setState(prev => ({ ...prev, logs: [], loading: false }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load logs';
            setState(prev => ({ ...prev, loading: false, error: errorMessage || 'Failed to load tour logs. Please try again later.' }));
        }
    }, []);

    const createLog = useCallback(async (tourId: string, data: TourLogRequest): Promise<boolean> => {
        try {
            const res = await TourLogService.createLog(tourId, data);
            if (res.success) {
                setState(prev => ({ ...prev, dialogOpen: false, editingLog: null, error: null }));
                return true;
            }
            const errorMessage = res.message || 'Failed to create log';
            setState(prev => ({ ...prev, error: errorMessage }));
            return false;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create log';
            setState(prev => ({ ...prev, error: errorMessage || 'Failed to create tour log. Please try again.' }));
            return false;
        }
    }, []);

    const updateLog = useCallback(async (tourId: string, logId: string, data: TourLogRequest): Promise<boolean> => {
        try {
            const res = await TourLogService.updateLog(tourId, logId, data);
            if (res.success) {
                setState(prev => ({ ...prev, dialogOpen: false, editingLog: null, error: null }));
                return true;
            }
            const errorMessage = res.message || 'Failed to update log';
            setState(prev => ({ ...prev, error: errorMessage }));
            return false;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update log';
            setState(prev => ({ ...prev, error: errorMessage || 'Failed to update tour log. Please try again.' }));
            return false;
        }
    }, []);

    const deleteLog = useCallback(async (tourId: string, logId: string): Promise<boolean> => {
        try {
            const res = await TourLogService.deleteLog(tourId, logId);
            if (res.success) {
                toast.success('Log deleted');
                setState(prev => ({
                    ...prev,
                    logs: prev.logs.filter(l => l.id !== logId),
                    error: null,
                }));
                return true;
            }
            const errorMessage = res.message || 'Failed to delete log';
            setState(prev => ({ ...prev, error: errorMessage }));
            return false;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete log';
            toast.error(errorMessage || 'Failed to delete log');
            setState(prev => ({ ...prev, error: errorMessage || 'Failed to delete tour log. Please try again.' }));
            return false;
        }
    }, []);

    const openCreateDialog = useCallback(() => {
        setState(prev => ({ ...prev, dialogOpen: true, editingLog: null }));
    }, []);

    const openEditDialog = useCallback((log: TourLog) => {
        setState(prev => ({ ...prev, dialogOpen: true, editingLog: log }));
    }, []);

    const closeDialog = useCallback(() => {
        setState(prev => ({ ...prev, dialogOpen: false, editingLog: null }));
    }, []);

    return {
        state,
        actions: { loadLogs, createLog, updateLog, deleteLog, openCreateDialog, openEditDialog, closeDialog },
    };
}
