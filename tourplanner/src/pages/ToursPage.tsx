import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { TourService } from "@/services/TourService";
import { TourList } from "@/components/TourList";
import { TourDetail } from "@/components/TourDetail";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";
import type { Tour } from "@/types/api";

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTours();
    }, []);

    const loadTours = async () => {
        try {
            setLoading(true);
            const res = await TourService.getTours();
            if (res.success && res.data) {
                setTours(res.data);
            }
        } catch (error) {
            console.error("Failed to load tours:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTour = async (id: string) => {
        try {
            await TourService.deleteTour(id);
            if (selectedTour?.id === id) {
                setSelectedTour(null);
            }
            loadTours();
        } catch (error) {
            console.error("Failed to delete tour:", error);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onCreateTour={() => {}}
                tours={tours}
                selectedTourId={selectedTour?.id}
                onSelectTour={setSelectedTour}
                onDeleteTour={handleDeleteTour}
            />

            <MobileMenuButton
                isOpen={sidebarOpen}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 md:ml-80">
                <div className="p-4 md:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted">Loading tours...</p>
                        </div>
                    ) : !selectedTour ? (
                        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px-4rem)] text-center">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-xl text-secondary mb-2">No tour selected</p>
                            <p className="text-sm text-muted mb-6">
                                Select a tour from the sidebar to view details.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl">
                            <TourDetail
                                tour={selectedTour}
                                onEdit={() => {}}
                                onDelete={() => handleDeleteTour(selectedTour.id)}
                                onCreateLog={() => {}}
                                onImageUpload={(path) => {
                                    setSelectedTour(prev => prev ? { ...prev, imagePath: path } : null);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}