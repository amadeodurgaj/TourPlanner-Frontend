import React from 'react';
import './App.css';
import { useEffect, useState } from "react";
import { apiGet } from "./api/ApiClient";
export default function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        apiGet("/api/hello")
            .then((data) => setMessage(data.message))
    }, []);

    return (
        <div>
            <h1>Frontend</h1>
            <p>{message}</p>
        </div>
    );
}

