import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TourLog, TourLogRequest } from "@/types/api";

interface CreateTourLogDialogProps {
  open: boolean;
  editLog?: TourLog | null;
  onClose: () => void;
  onSubmit: (data: TourLogRequest) => void;
}

const difficulties = ["EASY", "MEDIUM", "HARD"] as const;

export function CreateTourLogDialog({ open, editLog, onClose, onSubmit }: CreateTourLogDialogProps) {
  const [form, setForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    comment: "",
    difficulty: "EASY" as typeof difficulties[number],
    totalDistance: "",
    totalTime: "",
    rating: 5,
  });

  const isValid =
    form.dateTime &&
    form.difficulty &&
    form.totalDistance.trim() &&
    form.totalTime.trim() &&
    form.rating > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const logData: TourLogRequest = {
      dateTime: new Date(form.dateTime).toISOString(),
      comment: form.comment.trim(),
      difficulty: form.difficulty,
      totalDistance: Number(form.totalDistance),
      totalTime: Number(form.totalTime),
      rating: form.rating,
    };

    onSubmit(logData);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-lg border border-border/70 bg-card p-6 shadow-2xl shadow-black/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {editLog ? "Edit" : "Add"} <span className="text-accent">Tour Log</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Record your tour experience.</p>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="log-date" className="block text-sm font-medium text-foreground mb-2">
              Date & Time
            </label>
            <input
              id="log-date"
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
              className="field-control"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="log-distance" className="block text-sm font-medium text-foreground mb-2">
                Distance (km)
              </label>
              <input
                id="log-distance"
                type="number"
                step="0.1"
                min="0"
                value={form.totalDistance}
                onChange={(e) => setForm((p) => ({ ...p, totalDistance: e.target.value }))}
                placeholder="5.0"
                className="field-control"
              />
            </div>
            <div>
              <label htmlFor="log-time" className="block text-sm font-medium text-foreground mb-2">
                Time (minutes)
              </label>
              <input
                id="log-time"
                type="number"
                min="0"
                value={form.totalTime}
                onChange={(e) => setForm((p) => ({ ...p, totalTime: e.target.value }))}
                placeholder="30"
                className="field-control"
              />
            </div>
          </div>

          <div>
            <label htmlFor="log-difficulty" className="block text-sm font-medium text-foreground mb-2">
              Difficulty
            </label>
            <select
              id="log-difficulty"
              value={form.difficulty}
              onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value as typeof difficulties[number] }))}
              className="field-control"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, rating: star }))}
                  className={cn(
                    "h-10 w-10 rounded-lg text-sm font-semibold transition-smooth active-press",
                    star <= form.rating
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:border-accent/60 hover:bg-muted hover:text-accent"
                  )}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="log-comment" className="block text-sm font-medium text-foreground mb-2">
              Comment (optional)
            </label>
            <textarea
              id="log-comment"
              rows={3}
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              placeholder="How was your experience?"
              className="field-control resize-none"
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
              {editLog ? "Save Changes" : "Add Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTourLogDialog;
