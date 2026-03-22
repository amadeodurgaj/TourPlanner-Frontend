import { Navbar } from "@/components/Navbar";
import { useState } from "react";


export default function ToursPage() {
    
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center max-w-2xl">
                <h1 className="font-serif text-6xl font-bold tracking-tighter text-secondary mb-6">
                    Tours
                </h1>
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-6" />

            </div>
        </div>
    );
}