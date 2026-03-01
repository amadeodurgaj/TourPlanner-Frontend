import React from 'react';
import './App.css';
import { useEffect, useState } from "react";
import { apiGet } from "./api/ApiClient";
import  {Navbar}  from "./components/Navbar";


export default function App() {
    const [secondmessage, setSecondMessage] = useState("");
    const [message, setMessage] = useState("");
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        apiGet("/api/hello")
            .then((data) => setMessage(data.message))
    }, []);


    useEffect(() => {
        apiGet("/api/db-test")
            .then((data) => setSecondMessage(data.message))
    }, []);

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
        </div>
    );
}
