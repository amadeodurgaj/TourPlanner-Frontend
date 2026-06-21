import { useEffect, useState, useRef } from "react";
import { toast } from 'sonner';
import { MapPin } from "lucide-react";
import { useTourListViewModel } from "@/viewmodels/useTourListViewModel";
import { useTourLogViewModel } from "@/viewmodels/useTourLogViewModel";
import { useTourDetailViewModel } from "@/viewmodels/useTourDetailViewModel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { TourDetail } from "@/components/TourDetail";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";
import CreateTourLogDialog from "@/components/CreateTourLogDialog";
import EditTourDialog from "@/components/EditTourDialog";
import CreateTourDialog from "@/components/CreateTourDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { TourService } from "@/services/TourService";
import { staggerContainer, fadeUpItem } from "@/components/motion/AnimatePresence";
import { motion } from "framer-motion";
import type { TourRequest } from "@/types/api";

export default function ToursPage() {
  const { state, actions } = useTourListViewModel();
  const { state: logState, actions: logActions } = useTourLogViewModel();
  const { state: detailState, actions: detailActions } = useTourDetailViewModel();
  const { tours, selectedTour, loading, searchQuery } = state;
  const { selectTour, deleteTour, searchTours, refresh } = actions;
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedTour) {
      logActions.loadLogs(selectedTour.id);
    }
  }, [selectedTour?.id]);

  useKeyboardShortcuts({
    'Ctrl+N': () => setIsCreateTourOpen(true),
    'Ctrl+K': () => {
      const searchInput = document.querySelector<HTMLInputElement>('input[type="text"]');
      searchInput?.focus();
    },
    'Escape': () => {
      if (sidebarOpen) setSidebarOpen(false);
      if (selectedTour) selectTour(null);
    }
  });

  const handleCreateTour = async (data: TourRequest) => {
    try {
      await TourService.createTour(data);
      toast.success('Tour created successfully');
      setIsCreateTourOpen(false);
      await refresh();
    } catch (error) {
      console.error("Failed to create tour:", error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateTour={() => setIsCreateTourOpen(true)}
        tours={tours}
        selectedTourId={selectedTour?.id}
        onSelectTour={selectTour}
        onDeleteTour={deleteTour}
        searchQuery={searchQuery}
        onSearch={searchTours}
        onRefresh={refresh}
      />

      <MobileMenuButton
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 md:ml-80">
        <div className="mx-auto max-w-5xl p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Loading tours...
                </p>
              </div>
            </div>
          ) : !selectedTour ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUpItem}>
                <EmptyState
                  icon={<MapPin className="w-8 h-8 text-accent/80" />}
                  title="No tour selected"
                  description="Select a tour from the sidebar to view details, or create a new one."
                  action={{
                    label: "Create Tour",
                    icon: <MapPin className="w-4 h-4" />,
                    onClick: () => setIsCreateTourOpen(true)
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto max-w-4xl">
                <TourDetail
                  tour={selectedTour}
                  onEdit={detailActions.startEditing}
                  onDelete={() => deleteTour(selectedTour.id)}
                  onCreateLog={logActions.openCreateDialog}
                  onImageUpload={(path) => {
                    selectTour({ ...selectedTour, imagePath: path });
                  }}
                  onDownloadReport={() =>
                    detailActions.downloadReport(
                      selectedTour.id,
                      selectedTour.name,
                    )
                  }
                  downloading={detailState.downloading}
                  downloadError={detailState.error}
                  logs={logState.logs}
                  onEditLog={logActions.openEditDialog}
                  onDeleteLog={(id) => logActions.deleteLog(selectedTour.id, id)}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CreateTourDialog
        open={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        onSubmit={handleCreateTour}
      />

      {selectedTour && (
        <EditTourDialog
          open={detailState.editing}
          tour={selectedTour}
          onClose={detailActions.stopEditing}
          onSubmit={async (data) => {
            const updatedTour = await detailActions.updateTour(
              selectedTour.id,
              data,
            );
            if (updatedTour) {
              toast.success('Tour updated successfully');
              selectTour(updatedTour);
              await refresh();
            }
          }}
        />
      )}

      {selectedTour && (
        <CreateTourLogDialog
          open={logState.dialogOpen}
          editLog={logState.editingLog}
          onClose={logActions.closeDialog}
          onSubmit={async (data) => {
            if (logState.editingLog) {
              const ok = await logActions.updateLog(
                selectedTour.id,
                logState.editingLog.id,
                data,
              );
              if (ok) {
                toast.success('Log updated successfully');
                logActions.loadLogs(selectedTour.id);
              }
            } else {
              const ok = await logActions.createLog(selectedTour.id, data);
              if (ok) {
                toast.success('Log added successfully');
                logActions.loadLogs(selectedTour.id);
              }
            }
          }}
        />
      )}
    </div>
  );
}
