import { Calendar, Gauge, Timer, Star, Pencil, Trash2 } from "lucide-react";
import { cn, formatDistance, formatTime } from "@/lib/utils";
import type { TourLog } from "@/types/api";

interface TourLogListProps {
  logs: TourLog[];
  onEdit: (log: TourLog) => void;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-500/15 text-green-400",
  MEDIUM: "bg-yellow-500/15 text-yellow-400",
  HARD: "bg-red-500/15 text-red-400",
};

export function TourLogList({ logs, onEdit, onDelete }: TourLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-light">No logs yet. Create your first tour log.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {logs.map((log) => (
        <li
          key={log.id}
          className="group p-4 rounded-xl bg-primary border border-border/50 hover:border-border transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-light">
                <Calendar className="w-4 h-4" />
                {new Date(log.dateTime).toLocaleDateString()}
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium capitalize",
                  difficultyColors[log.difficulty]
                )}
              >
                {log.difficulty.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(log)}
                className="p-1.5 rounded text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(log.id)}
                className="p-1.5 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted">
              <Gauge className="w-4 h-4 text-accent" />
              <span>{formatDistance(log.totalDistance)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Timer className="w-4 h-4 text-accent" />
              <span>{formatTime(log.totalTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Star className="w-4 h-4 text-accent" />
              <span>{log.rating}/5</span>
            </div>
          </div>

          {log.comment && (
            <p className="mt-3 text-sm text-muted-light border-t border-border/50 pt-3">
              {log.comment}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TourLogList;