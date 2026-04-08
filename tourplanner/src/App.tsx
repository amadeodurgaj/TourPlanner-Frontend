import './App.css';
import { useEffect, useState } from "react";
import  {Navbar}  from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import ToursPage from './pages/ToursPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './components/LoginForm';
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import Home from './pages/Home';


export default function App() {

    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light');
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className={theme}>
            <Navbar theme={theme} setTheme={setTheme} />
            <Routes>
                <Route path="/login" element={
                    <GuestRoute><LoginForm /></GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute><RegisterPage /></GuestRoute>
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
        </div>
    );
}
