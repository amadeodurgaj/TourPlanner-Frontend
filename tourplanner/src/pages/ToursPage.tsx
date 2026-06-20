import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useTourListViewModel } from "@/viewmodels/useTourListViewModel";
import { useTourLogViewModel } from "@/viewmodels/useTourLogViewModel";
import { useTourDetailViewModel } from "@/viewmodels/useTourDetailViewModel";
import { TourDetail } from "@/components/TourDetail";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";
import CreateTourLogDialog from "@/components/CreateTourLogDialog";
import EditTourDialog from "@/components/EditTourDialog";
import CreateTourDialog from "@/components/CreateTourDialog";
import { TourService } from "@/services/TourService";
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

  const handleCreateTour = async (data: TourRequest) => {
    try {
      await TourService.createTour(data);
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
            <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No tour selected
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Select a tour from the sidebar to view details.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Dialogs – always in the DOM, controlled by their open/open props */}
      <CreateTourDialog
        open={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        onSubmit={handleCreateTour}
      />

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
            selectTour(updatedTour);
            await refresh();
          }
        }}
      />

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
            if (ok) logActions.loadLogs(selectedTour.id);
          } else {
            const ok = await logActions.createLog(selectedTour.id, data);
            if (ok) logActions.loadLogs(selectedTour.id);
          }
        }}
      />
    </div>
  );
}