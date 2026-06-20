import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import type { LocationSearchResult, TourRequest } from "@/types/api";

type CreateTourDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TourRequest) => void;
};

type FormState = {
  name: string;
  description: string;
  transportType: string;
  fromLocation: LocationSearchResult | null;
  toLocation: LocationSearchResult | null;
};

const initialForm: FormState = {
  name: "",
  description: "",
  transportType: "foot",
  fromLocation: null,
  toLocation: null,
};

export default function CreateTourDialog({
  open,
  onClose,
  onSubmit,
}: CreateTourDialogProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

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
    form.transportType.trim() &&
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
              Create <span className="text-accent">Tour</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the basic tour details to get started.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="tour-name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Name
            </label>
            <input
              id="tour-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Morning Hike"
              className="field-control"
            />
          </div>

          <div>
            <label
              htmlFor="tour-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="tour-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="A beautiful morning hike through the mountains"
              className="field-control resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="transport-type"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Transport Type
            </label>
            <select
              id="transport-type"
              value={form.transportType}
              onChange={(e) => setForm((prev) => ({ ...prev, transportType: e.target.value }))}
              className="field-control"
            >
              <option value="foot">Foot / Hike</option>
              <option value="bike">Bike</option>
              <option value="running">Running</option>
              <option value="car">Car / Vacation</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PlaceAutocompleteInput
              label="From"
              placeholder="Start location"
              value={form.fromLocation}
              onSelect={(location) => setForm((prev) => ({ ...prev, fromLocation: location }))}
              onClear={() => setForm((prev) => ({ ...prev, fromLocation: null }))}
            />

            <PlaceAutocompleteInput
              label="To"
              placeholder="Destination"
              value={form.toLocation}
              onSelect={(location) => setForm((prev) => ({ ...prev, toLocation: location }))}
              onClear={() => setForm((prev) => ({ ...prev, toLocation: null }))}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
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
              className="btn-primary"
            >
              Create Tour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
