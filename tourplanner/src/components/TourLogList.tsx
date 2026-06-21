import { Calendar, Gauge, Timer, Star, Pencil, Trash2 } from "lucide-react";
import { cn, formatDistance, formatTime } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import type { TourLog } from "@/types/api";

interface TourLogListProps {
  logs: TourLog[];
  onEdit: (log: TourLog) => void;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-success/15 text-success",
  MEDIUM: "bg-warning/15 text-warning",
  HARD: "bg-destructive/15 text-destructive",
};

export function TourLogList({ logs, onEdit, onDelete }: TourLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No logs yet. Create your first tour log.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {logs.map((log) => (
        <li key={log.id}>
          <Card variant="default" padding="sm" className="group">
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="tabular-nums">{new Date(log.dateTime).toLocaleDateString()}</span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-medium capitalize",
                  difficultyColors[log.difficulty]
                )}
              >
                {log.difficulty.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-smooth group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                onClick={() => onEdit(log)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-smooth"
                aria-label="Edit log"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(log.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                aria-label="Delete log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="w-4 h-4 text-accent" />
              <span className="tabular-nums">{formatDistance(log.totalDistance)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Timer className="w-4 h-4 text-accent" />
              <span className="tabular-nums">{formatTime(log.totalTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="w-4 h-4 text-accent" />
              <span className="tabular-nums">{log.rating}/5</span>
            </div>
          </div>

          {log.comment && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
              {log.comment}
            </p>
          )}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default TourLogList;
