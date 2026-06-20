import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import { cn } from "@/lib/utils";
import type { LocationSearchResult, Tour, TourRequest } from "@/types/api";

interface EditTourDialogProps {
  open: boolean;
  tour: Tour | null;
  onClose: () => void;
  onSubmit: (data: TourRequest) => void;
}

const transportTypes = ["foot", "bike", "running", "car"] as const;

export function EditTourDialog({ open, tour, onClose, onSubmit }: EditTourDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    transportType: "foot",
    fromLocation: null as LocationSearchResult | null,
    toLocation: null as LocationSearchResult | null,
  });

  useEffect(() => {
    if (tour && open) {
      setForm({
        name: tour.name,
        description: tour.description,
        transportType: tour.transportType,
        fromLocation: tour.fromLatitude && tour.fromLongitude
          ? { label: tour.fromLocation, latitude: tour.fromLatitude, longitude: tour.fromLongitude }
          : null,
        toLocation: tour.toLatitude && tour.toLongitude
          ? { label: tour.toLocation, latitude: tour.toLatitude, longitude: tour.toLongitude }
          : null,
      });
    }
  }, [tour, open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const isValid =
    form.name.trim() &&
    form.description.trim() &&
    form.fromLocation &&
    form.toLocation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !form.fromLocation || !form.toLocation) return;

    const tourData: TourRequest = {
      name: form.name.trim(),
      description: form.description.trim(),
      transportType: form.transportType,
      fromLocation: form.fromLocation.label,
      fromLatitude: form.fromLocation.latitude,
      fromLongitude: form.fromLocation.longitude,
      toLocation: form.toLocation.label,
      toLatitude: form.toLocation.latitude,
      toLongitude: form.toLocation.longitude,
      distance: 0,
      estimatedTime: null,
      routeInfo: null,
    };

    onSubmit(tourData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-border/70 bg-card p-6 shadow-2xl shadow-black/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Edit <span className="text-accent">Tour</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Update tour details.</p>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-tour-name" className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              id="edit-tour-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="field-control"
            />
          </div>

          <div>
            <label htmlFor="edit-tour-description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="edit-tour-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="field-control resize-none"
            />
          </div>

          <div>
            <label htmlFor="edit-transport" className="block text-sm font-medium text-foreground mb-2">
              Transport Type
            </label>
            <select
              id="edit-transport"
              value={form.transportType}
              onChange={(e) => setForm((p) => ({ ...p, transportType: e.target.value }))}
              className="field-control"
            >
              {transportTypes.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t === "foot" ? "Foot / Hike" : t === "bike" ? "Bike" : t === "running" ? "Running" : "Car / Vacation"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PlaceAutocompleteInput
              label="From"
              placeholder="Start location"
              value={form.fromLocation}
              onSelect={(loc) => setForm((p) => ({ ...p, fromLocation: loc }))}
              onClear={() => setForm((p) => ({ ...p, fromLocation: null }))}
            />
            <PlaceAutocompleteInput
              label="To"
              placeholder="Destination"
              value={form.toLocation}
              onSelect={(loc) => setForm((p) => ({ ...p, toLocation: loc }))}
              onClear={() => setForm((p) => ({ ...p, toLocation: null }))}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={cn(
                "btn-primary",
                !isValid && "opacity-50 cursor-not-allowed"
              )}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTourDialog;
