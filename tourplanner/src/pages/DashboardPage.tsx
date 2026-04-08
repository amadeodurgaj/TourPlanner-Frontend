import { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";
import { TourList } from "@/components/TourList";
import { TourDetail } from "@/components/TourDetail";
import { TourLogList } from "@/components/TourLogList";
import { TourService } from "@/services/TourService";
import { TourLogService } from "@/services/TourLogService";
import CreateTourDialog from "@/components/CreateTourDialog";
import EditTourDialog from "@/components/EditTourDialog";
import CreateTourLogDialog from "@/components/CreateTourLogDialog";
import type { Tour, TourRequest, TourLog, TourLogRequest } from "@/types/api";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [logs, setLogs] = useState<TourLog[]>([]);

  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [isEditTourOpen, setIsEditTourOpen] = useState(false);
  const [isCreateLogOpen, setIsCreateLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TourLog | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTours();
  }, []);

  useEffect(() => {
    if (selectedTour) {
      loadLogs(selectedTour.id);
    } else {
      setLogs([]);
    }
  }, [selectedTour?.id]);

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

  const loadLogs = async (tourId: string) => {
    try {
      const res = await TourLogService.getLogs(tourId);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  };

  const handleCreateTour = async (data: TourRequest) => {
    try {
      await TourService.createTour(data);
      setIsCreateTourOpen(false);
      loadTours();
    } catch (error) {
      console.error("Failed to create tour:", error);
    }
  };

  const handleEditTour = async (data: TourRequest) => {
    if (!selectedTour) return;
    try {
      const res = await TourService.updateTour(selectedTour.id, data);
      setIsEditTourOpen(false);
      loadTours();
      if (res.success && res.data) {
        setSelectedTour(res.data);
      }
    } catch (error) {
      console.error("Failed to update tour:", error);
    }
  };

  const handleImageUpload = (imagePath: string) => {
    setSelectedTour((prev) => (prev ? { ...prev, imagePath } : null));
    loadTours();
  };

  const handleDeleteTour = async () => {
    if (!selectedTour) return;
    if (!confirm("Delete this tour?")) return;
    try {
      await TourService.deleteTour(selectedTour.id);
      setSelectedTour(null);
      loadTours();
    } catch (error) {
      console.error("Failed to delete tour:", error);
    }
  };

  const handleDeleteTourFromList = async (id: string) => {
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

  const handleCreateLog = async (data: TourLogRequest) => {
    if (!selectedTour) return;
    try {
      await TourLogService.createLog(selectedTour.id, data);
      setIsCreateLogOpen(false);
      loadLogs(selectedTour.id);
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  };

  const handleEditLog = async (data: TourLogRequest) => {
    if (!selectedTour || !editingLog) return;
    try {
      await TourLogService.updateLog(selectedTour.id, editingLog.id, data);
      setEditingLog(null);
      setIsCreateLogOpen(false);
      loadLogs(selectedTour.id);
    } catch (error) {
      console.error("Failed to update log:", error);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!selectedTour) return;
    if (!confirm("Delete this log?")) return;
    try {
      await TourLogService.deleteLog(selectedTour.id, id);
      loadLogs(selectedTour.id);
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  const handleEditLogFromList = (log: TourLog) => {
    setEditingLog(log);
    setIsCreateLogOpen(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateTour={() => setIsCreateTourOpen(true)}
        tours={tours}
        selectedTourId={selectedTour?.id}
        onSelectTour={setSelectedTour}
        onDeleteTour={handleDeleteTourFromList}
      />

      <MobileMenuButton
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 md:ml-80">
        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted">Loading...</p>
            </div>
          ) : !selectedTour ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px-4rem)] text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-muted-light" />
              </div>
              <p className="text-xl text-secondary mb-2">No tour selected</p>
              <p className="text-sm text-muted mb-6">
                Select a tour from the sidebar or create a new one.
              </p>
              <button
                onClick={() => setIsCreateTourOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-primary font-medium hover:bg-accent-hover transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Tour
              </button>
            </div>
          ) : (
            <div className="max-w-3xl">
              <TourDetail
                tour={selectedTour}
                logs={logs}
                onEdit={() => setIsEditTourOpen(true)}
                onDelete={handleDeleteTour}
                onCreateLog={() => {
                  setEditingLog(null);
                  setIsCreateLogOpen(true);
                }}
                onEditLog={handleEditLogFromList}
                onDeleteLog={handleDeleteLog}
                onImageUpload={handleImageUpload}
              />

              <div className="mt-8">
                <TourLogList
                  logs={logs}
                  onEdit={handleEditLogFromList}
                  onDelete={handleDeleteLog}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateTourDialog
        open={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        onSubmit={handleCreateTour}
      />

      <EditTourDialog
        open={isEditTourOpen}
        tour={selectedTour}
        onClose={() => setIsEditTourOpen(false)}
        onSubmit={handleEditTour}
      />

      <CreateTourLogDialog
        open={isCreateLogOpen}
        editLog={editingLog || undefined}
        onClose={() => {
          setIsCreateLogOpen(false);
          setEditingLog(null);
        }}
        onSubmit={editingLog ? handleEditLog : handleCreateLog}
      />
    </div>
  );
}