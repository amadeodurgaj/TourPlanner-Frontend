import { useState, useCallback, useMemo } from 'react';
import AuthService from '@/services/AuthService';

interface User {
    username: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export function useAuthViewModel(): { state: AuthState; actions: AuthActions } {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    });

    const checkAuth = useCallback(async () => {
        try {
            const response = await AuthService.getCurrentUser();
            if (response?.data) {
                setState(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    user: { username: response.data.username },
                    loading: false,
                    error: null,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: null,
                }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
            setState(prev => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: errorMessage.includes('invalid or expired') ? errorMessage : null,
            }));
        }
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            await AuthService.login({ username, password });
            await checkAuth();
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage.includes('Invalid username or password') ? errorMessage : 'Invalid username or password. Please try again.',
            }));
            return false;
        }
    }, [checkAuth]);

    const logout = useCallback(() => {
        setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
    }, []);

    const actions = useMemo(() => ({ login, logout, checkAuth }), [login, logout, checkAuth]);

    return { state, actions };
}
