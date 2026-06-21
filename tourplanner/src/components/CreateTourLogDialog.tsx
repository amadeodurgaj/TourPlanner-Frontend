import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
  function toLocalDatetimeString(date: Date): string {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
  }

  const initialFormState = {
    dateTime: toLocalDatetimeString(new Date()),
    comment: "",
    difficulty: "EASY" as typeof difficulties[number],
    totalDistance: "",
    totalTime: "",
    rating: 5,
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (editLog) {
      setForm({
        dateTime: toLocalDatetimeString(new Date(editLog.dateTime + 'Z')),
        comment: editLog.comment,
        difficulty: editLog.difficulty,
        totalDistance: String(editLog.totalDistance),
        totalTime: String(editLog.totalTime),
        rating: editLog.rating,
      });
    }
  }, [editLog]);

  useEffect(() => {
    if (!open) {
      setForm(initialFormState);
    }
  }, [open]);

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
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="log-date"
            label="Date & Time"
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="log-distance"
              label="Distance (km)"
              type="number"
              step="0.1"
              min="0"
              value={form.totalDistance}
              onChange={(e) => setForm((p) => ({ ...p, totalDistance: e.target.value }))}
              placeholder="5.0"
              required
            />
            <Input
              id="log-time"
              label="Time (minutes)"
              type="number"
              min="0"
              value={form.totalTime}
              onChange={(e) => setForm((p) => ({ ...p, totalTime: e.target.value }))}
              placeholder="30"
              required
            />
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
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
            >
              {editLog ? "Save Changes" : "Add Log"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTourLogDialog;
