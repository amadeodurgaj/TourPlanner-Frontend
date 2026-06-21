import './App.css';
import { useEffect, useState } from "react";
import  {Navbar}  from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { useScrollToTop } from './hooks/useScrollToTop';
import ToursPage from './pages/ToursPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import Home from './pages/Home';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';


export default function App() {

    useScrollToTop();

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme-manual')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        prefersDark.addEventListener('change', handler);
        return () => prefersDark.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className={`${theme} min-h-screen bg-background text-foreground`}>
            <Toaster
                position="top-right"
                richColors
            />
            <Navbar theme={theme} setTheme={setTheme} />
            <ErrorBoundary>
            <Routes>
                <Route path="/login" element={
                    <GuestRoute><LoginForm /></GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute><RegisterPage /></GuestRoute>
                } />
                <Route path="/forgot-password" element={
                    <GuestRoute><ForgotPasswordPage /></GuestRoute>
                } />
                <Route path="/reset-password/:token" element={
                    <GuestRoute><ResetPasswordPage /></GuestRoute>
                } />
                <Route path="/tours" element={
                    <ProtectedRoute><ToursPage /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/logout" element={
                    <ProtectedRoute><LogoutPage /></ProtectedRoute>
                } />
                <Route path="/*" element={<Home />} />
            </Routes>
            </ErrorBoundary>
        </div>
    );
}
