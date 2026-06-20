import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string } | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { state, actions } = useAuthViewModel();

    useEffect(() => {
        actions.checkAuth();
    }, [actions.checkAuth]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                loading: state.loading,
                error: state.error,
                login: actions.login,
                logout: actions.logout,
                checkAuth: actions.checkAuth,
            }}
        >
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
