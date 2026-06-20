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
  const totalDistance = tours.reduce((sum, tour) => sum + tour.distance, 0);
  const avgPopularity = totalTours > 0
    ? Math.round(tours.reduce((sum, tour) => sum + tour.popularityScore, 0) / totalTours)
    : 0;
  const avgChildFriendly = totalTours > 0
    ? Math.round(tours.reduce((sum, tour) => sum + tour.childFriendliness, 0) / totalTours)
    : 0;

  const transportCounts = tours.reduce((acc, tour) => {
    const key = tour.transportType || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const transportData = Object.entries(transportCounts)
    .map(([type, count]) => ({
      type,
      label: TRANSPORT_LABELS[type] || type,
      Icon: TRANSPORT_ICONS[type] || Footprints,
      count,
      pct: totalTours > 0 ? Math.round((count / totalTours) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const recentTours = [...tours]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-secondary">Dashboard</h1>
          <p className="mt-2 text-base text-muted">Overview of all your tours</p>
        </div>
        <button
          onClick={() => setIsCreateTourOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-primary transition-colors hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Create Tour
        </button>
      </div>

      {totalTours === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
            <Route className="h-10 w-10 text-accent" />
          </div>
          <h2 className="mb-3 text-2xl font-semibold text-secondary">No tours yet</h2>
          <p className="mb-8 max-w-sm text-base text-muted">
            Create your first tour to see statistics and insights here.
          </p>
          <button
            onClick={() => setIsCreateTourOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-primary transition-colors hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Create Your First Tour
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Route} label="Total Tours" value={totalTours.toString()} />
            <StatCard
              icon={MapPin}
              label="Total Distance"
              value={`${totalDistance < 10 ? totalDistance.toFixed(1) : Math.round(totalDistance)} km`}
            />
            <StatCard icon={Star} label="Avg Popularity" value={`${avgPopularity}%`} />
            <StatCard icon={Heart} label="Avg Child-Friendly" value={`${avgChildFriendly}%`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border/50 bg-primary p-6">
              <h2 className="mb-5 text-lg font-semibold uppercase tracking-wider text-secondary">
                Transport Breakdown
              </h2>
              <div className="space-y-5">
                {transportData.map(({ type, label, Icon, count, pct }) => (
                  <div key={type}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-secondary">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <Icon className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium">{label}</span>
                      </div>
                      <span className="text-sm font-medium tabular-nums text-muted">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-secondary/10">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border/50 bg-primary p-6">
              <h2 className="mb-5 text-lg font-semibold uppercase tracking-wider text-secondary">
                Recent Tours
              </h2>
              <div className="space-y-4">
                {recentTours.map((tour) => {
                  const Icon = TRANSPORT_ICONS[tour.transportType] || Footprints;
                  return (
                    <button
                      key={tour.id}
                      onClick={() => navigate("/tours")}
                      className="flex w-full items-center justify-between rounded-xl border border-border/50 p-4 text-left transition-colors hover:border-accent/50 hover:bg-accent/5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                          <Icon className="h-5 w-5 text-muted" />
                        </div>
                        <span className="truncate font-medium text-secondary">{tour.name}</span>
                      </div>
                      <div className="ml-4 flex flex-shrink-0 items-center gap-3 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {tour.popularityScore}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {tour.childFriendliness}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/tours")}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-6 py-3.5 text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              View All Tours
              <ArrowRight className="h-4 w-4" />
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

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Route;
  label: string;
  value: string;
}) {
  return (
    <section className="rounded-xl border border-border/50 bg-primary p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <p className="text-3xl font-bold tabular-nums text-secondary">{value}</p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">{label}</p>
    </section>
  );
}
