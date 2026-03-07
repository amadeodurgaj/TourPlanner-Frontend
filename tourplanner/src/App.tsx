import './App.css';
import { useEffect, useState } from "react";
import  {Navbar}  from "./components/Navbar";
import { Routes, Route } from 'react-router-dom';
import ToursPage from './pages/ToursPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './components/LoginForm';
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';


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
                <Route path="/tours" element={<ToursPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/*" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
            </Routes>
        </div>
    );
}
