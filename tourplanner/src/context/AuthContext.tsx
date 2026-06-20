import { createContext, useCallback, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel';

interface User {
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username?: string, password?: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { state, actions } = useAuthViewModel();

    const login = useCallback(async (username?: string, password?: string) => {
        if (username && password) {
            return actions.login(username, password);
        }

        await actions.checkAuth();
        return true;
    }, [actions]);

    useEffect(() => {
        actions.checkAuth();
    }, [actions.checkAuth]);

    const value = useMemo(() => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout: actions.logout,
        checkAuth: actions.checkAuth,
    }), [actions.checkAuth, actions.logout, login, state.error, state.isAuthenticated, state.loading, state.user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
