import { useState } from "react";
import { CircleX } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-primary p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">
              {editLog ? "Edit" : "Add"} <span className="text-accent">Tour Log</span>
            </h2>
            <p className="text-sm text-muted mt-1">Record your tour experience.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <CircleX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="log-date" className="block text-sm font-medium text-secondary mb-2">
              Date & Time
            </label>
            <input
              id="log-date"
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-primary text-secondary outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="log-distance" className="block text-sm font-medium text-secondary mb-2">
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
                className="w-full px-4 py-3 rounded-xl border border-border bg-primary text-secondary outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="log-time" className="block text-sm font-medium text-secondary mb-2">
                Time (minutes)
              </label>
              <input
                id="log-time"
                type="number"
                min="0"
                value={form.totalTime}
                onChange={(e) => setForm((p) => ({ ...p, totalTime: e.target.value }))}
                placeholder="30"
                className="w-full px-4 py-3 rounded-xl border border-border bg-primary text-secondary outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="log-difficulty" className="block text-sm font-medium text-secondary mb-2">
              Difficulty
            </label>
            <select
              id="log-difficulty"
              value={form.difficulty}
              onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value as typeof difficulties[number] }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-primary text-secondary outline-none focus:border-accent transition-colors"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, rating: star }))}
                  className={cn(
                    "w-10 h-10 rounded-lg text-lg font-medium transition-colors cursor-pointer",
                    star <= form.rating
                      ? "bg-accent text-primary"
                      : "border border-border text-muted hover:border-accent hover:text-accent"
                  )}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="log-comment" className="block text-sm font-medium text-secondary mb-2">
              Comment (optional)
            </label>
            <textarea
              id="log-comment"
              rows={3}
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              placeholder="How was your experience?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-primary text-secondary outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-danger text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={cn(
                "px-4 py-2 rounded-xl bg-accent text-primary font-medium hover:bg-accent-hover transition-colors cursor-pointer",
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
