import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Route, Star, Heart, Bike, CarFront, Footprints, Zap, ArrowRight, MapPin } from "lucide-react";
import { TourService } from "@/services/TourService";
import CreateTourDialog from "@/components/CreateTourDialog";
import type { Tour, TourRequest } from "@/types/api";

const TRANSPORT_LABELS: Record<string, string> = {
  foot: "Walking",
  bike: "Biking",
  running: "Running",
  car: "Driving",
};

const TRANSPORT_ICONS: Record<string, typeof Footprints> = {
  foot: Footprints,
  bike: Bike,
  running: Zap,
  car: CarFront,
};

const TRANSPORT_COLORS: Record<string, string> = {
  foot: "var(--color-accent)",
  bike: "var(--color-success)",
  running: "var(--color-warning)",
  car: "var(--color-muted-foreground)",
};

export default function DashboardPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const res = await TourService.getTours();
      if (res.success && res.data) {
        setTours(res.data);
      }
    } catch (error) {
      console.error("Failed to load tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (data: TourRequest) => {
    try {
      await TourService.createTour(data);
      setIsCreateTourOpen(false);
      loadTours();
    } catch (error) {
      console.error("Failed to create tour:", error);
    }
  };

  const totalTours = tours.length;
  const totalDistance = tours.reduce((sum, t) => sum + t.distance, 0);
  const avgPopularity = totalTours > 0
    ? Math.round(tours.reduce((sum, t) => sum + t.popularityScore, 0) / totalTours)
    : 0;
  const avgChildFriendly = totalTours > 0
    ? Math.round(tours.reduce((sum, t) => sum + t.childFriendliness, 0) / totalTours)
    : 0;

  const transportCounts = tours.reduce((acc, t) => {
    const key = t.transportType || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const transportData = Object.entries(transportCounts)
    .map(([type, count]) => ({
      type,
      label: TRANSPORT_LABELS[type] || type,
      Icon: TRANSPORT_ICONS[type] || Footprints,
      color: TRANSPORT_COLORS[type] || "var(--color-muted-foreground)",
      count,
      pct: totalTours > 0 ? Math.round((count / totalTours) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const recentTours = [...tours]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner-md border-t-accent" />
          <p className="text-sm text-muted-foreground/80">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-2 text-base text-muted-foreground/80">Overview of all your tours</p>
        </div>
        <button
          onClick={() => setIsCreateTourOpen(true)}
          className="btn-primary px-5 py-3 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Tour
        </button>
      </div>

      {totalTours === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
            <Route className="w-10 h-10 text-accent/80" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">No tours yet</h2>
          <p className="text-base text-muted-foreground/80 mb-8 max-w-sm">
            Create your first tour to see statistics and insights here.
          </p>
          <button
            onClick={() => setIsCreateTourOpen(true)}
            className="btn-primary px-6 py-3.5 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Create Your First Tour
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {/* Total Tours Card */}
            <div className="panel-soft p-6 hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
                  <Route className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{totalTours}</p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Total Tours</p>
            </div>

            {/* Total Distance Card */}
            <div className="panel-soft p-6 hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 ring-1 ring-success/20">
                  <MapPin className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {totalDistance < 10 ? totalDistance.toFixed(1) : Math.round(totalDistance)}
                <span className="text-xl text-muted-foreground/80 ml-1">km</span>
              </p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Total Distance</p>
            </div>

            {/* Avg Popularity Card */}
            <div className="panel-soft p-6 hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning/15 to-warning/5 ring-1 ring-warning/20">
                  <Star className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{avgPopularity}<span className="text-xl text-muted-foreground/80 ml-1">%</span></p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Avg Popularity</p>
            </div>

            {/* Avg Child-Friendly Card */}
            <div className="panel-soft p-6 hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{avgChildFriendly}<span className="text-xl text-muted-foreground/80 ml-1">%</span></p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Avg Child-Friendly</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transport Breakdown - Enhanced */}
            <div className="panel-soft p-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider mb-5">Transport Breakdown</h2>
              <div className="space-y-5">
                {transportData.map(({ type, label, Icon, color, count, pct }) => (
                  <div key={type} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: color + "15" }}>
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <span className="font-medium">{label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground/80 tabular-nums font-medium">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted/80 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:shadow-soft"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tours - Enhanced */}
            <div className="panel-soft p-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider mb-5">Recent Tours</h2>
              {recentTours.length === 0 ? (
                <p className="text-base text-muted-foreground/80 text-center py-6">No tours created yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentTours.map((tour) => {
                    const Icon = TRANSPORT_ICONS[tour.transportType] || Footprints;
                    return (
                      <div
                        key={tour.id}
                        className="flex items-center justify-between rounded-xl border border-border/60 p-4 transition-smooth hover:border-border hover:bg-accent/5 cursor-pointer group"
                        onClick={() => navigate("/tours")}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 flex-shrink-0">
                            <Icon className="w-5 h-5 text-muted-foreground/80 group-hover:text-accent transition-colors" />
                          </div>
                          <span className="text-base text-foreground font-medium truncate">{tour.name}</span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <span className="badge badge-accent">
                            <Star className="w-4 h-4" />
                            {tour.popularityScore}%
                          </span>
                          <span className="badge badge-success">
                            <Heart className="w-4 h-4" />
                            {tour.childFriendliness}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* View All Tours Button - Enhanced */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/tours")}
              className="btn-secondary px-6 py-3.5 border-border/80 hover:border-accent/40"
            >
              View All Tours
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <CreateTourDialog
        open={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        onSubmit={handleCreateTour}
      />
    </div>
  );
}
