import { MapPin, Footprints, Bike, Timer } from "lucide-react";
import { cn, formatDistance, formatTime } from "@/lib/utils";
import { API_URL } from "@/api/ApiClient";
import type { Tour } from "@/types/api";

interface TourListProps {
  tours: Tour[];
  selectedId?: string;
  onSelect: (tour: Tour) => void;
  onDelete: (id: string) => void;
}

const transportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  foot: Footprints,
  bike: Bike,
  running: Footprints,
  car: Bike,
};

export function TourList({ tours, selectedId, onSelect, onDelete }: TourListProps) {
  if (tours.length === 0) {
    return (
      <p className="text-sm text-muted px-3 py-8 text-center">
        No tours yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {tours.map((tour) => {
        const Icon = transportIcons[tour.transportType] || MapPin;
        const isSelected = tour.id === selectedId;

        return (
          <li key={tour.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(tour)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(tour);
                }
              }}
              className={cn(
                "group relative w-full text-left px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                isSelected ? "bg-accent/15" : "hover:bg-primary"
              )}
            >
              <div className="flex items-start gap-3">
                {tour.imagePath ? (
                  <img
                    src={`${API_URL}${tour.imagePath}`}
                    alt=""
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex-shrink-0 p-1.5 rounded-md",
                      isSelected ? "bg-accent/20 text-accent" : "bg-primary text-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-medium text-sm truncate transition-colors",
                      isSelected ? "text-secondary" : "text-muted group-hover:text-secondary"
                    )}
                  >
                    {tour.name}
                  </h4>
                  <p className="text-xs text-muted-light truncate">
                    {tour.fromLocation} → {tour.toLocation}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-light">
                    <span>{formatDistance(tour.distance)}</span>
                    {tour.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {tour.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tour.id);
                  }}
                  aria-label={`Delete ${tour.name}`}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default TourList;