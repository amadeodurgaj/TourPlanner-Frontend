import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Baby, Bike, Car, Footprints, MapPin, Star, Timer, Trash2 } from "lucide-react";
import { cn, formatDistance } from "@/lib/utils";
import { API_URL } from "@/api/ApiClient";
import { Card } from "@/components/ui/Card";
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
  car: Car,
};

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
};

export const TourList = memo(function TourList({ tours, selectedId, onSelect, onDelete }: TourListProps) {
  if (tours.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-3 py-8 text-center">
        No tours yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {tours.map((tour) => {
          const Icon = transportIcons[tour.transportType] || MapPin;
          const isSelected = tour.id === selectedId;

          return (
            <motion.li
              key={tour.id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              layout
            >
              <Card
                variant={isSelected ? "interactive" : "default"}
                padding="sm"
                className={cn(
                  "group relative overflow-hidden cursor-pointer",
                  isSelected && "ring-2 ring-accent/30 border-accent/40"
                )}
                whileHover={{ y: -1, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(tour)}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selection-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-start gap-3 pl-1">
                  {tour.imagePath ? (
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-border/50">
                      <img
                        src={`${API_URL}${tour.imagePath}`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-1 ring-border/50",
                        isSelected ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4
                      className={cn(
                        "font-semibold text-sm truncate transition-colors",
                        isSelected ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
                      )}
                    >
                      {tour.name}
                    </h4>

                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{tour.fromLocation}</span>
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-accent/70" />
                      <span className="truncate">{tour.toLocation}</span>
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                      <span className="tabular-nums font-medium">{formatDistance(tour.distance)}</span>
                      {tour.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span className="tabular-nums font-medium">{tour.estimatedTime}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                        tour.popularityScore >= 60 ? "bg-success/15 text-success" :
                        tour.popularityScore >= 20 ? "bg-warning/15 text-warning" :
                        "bg-muted/50 text-muted-foreground/70"
                      )}>
                        <Star className="h-3 w-3" />
                        {tour.popularityScore}%
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                        tour.childFriendliness >= 60 ? "bg-accent/15 text-accent" :
                        tour.childFriendliness >= 20 ? "bg-warning/15 text-warning" :
                        "bg-muted/50 text-muted-foreground/70"
                      )}>
                        <Baby className="h-3 w-3" />
                        {tour.childFriendliness}%
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(tour.id);
                    }}
                    aria-label={`Delete ${tour.name}`}
                    className="rounded-lg p-2 text-muted-foreground/70 transition-smooth hover:bg-destructive/10 hover:text-destructive self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
});
