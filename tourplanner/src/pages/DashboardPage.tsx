import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Plus, Route, Star, Heart, Bike, CarFront, Footprints, Zap, ArrowRight, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { TourService } from "@/services/TourService";
import CreateTourDialog from "@/components/CreateTourDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUpItem } from "@/components/motion/AnimatePresence";
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

const CHART_COLORS: Record<string, string> = {
  foot: '#3b82f6',
  bike: '#22c55e',
  running: '#f59e0b',
  car: '#6b7280'
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
      toast.success('Tour created successfully');
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
    <motion.div
      className="mx-auto max-w-5xl p-4 md:p-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem} className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-2 text-base text-muted-foreground/80">Overview of all your tours</p>
        </div>
        <Button
          onClick={() => setIsCreateTourOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="lg"
        >
          Create Tour
        </Button>
      </motion.div>

      {totalTours === 0 ? (
        <motion.div variants={fadeUpItem} className="flex flex-col items-center justify-center py-28 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
            <Route className="w-10 h-10 text-accent/80" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">No tours yet</h2>
          <p className="text-base text-muted-foreground/80 mb-8 max-w-sm">
            Create your first tour to see statistics and insights here.
          </p>
          <Button
            onClick={() => setIsCreateTourOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Create Your First Tour
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUpItem} className="flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card variant="elevated" padding="md" className="hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
                  <Route className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{totalTours}</p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Total Tours</p>
            </Card>
            <Card variant="elevated" padding="md" className="hover-lift transition-smooth">
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
            </Card>
            <Card variant="elevated" padding="md" className="hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning/15 to-warning/5 ring-1 ring-warning/20">
                  <Star className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{avgPopularity}<span className="text-xl text-muted-foreground/80 ml-1">%</span></p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Avg Popularity</p>
            </Card>
            <Card variant="elevated" padding="md" className="hover-lift transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">{avgChildFriendly}<span className="text-xl text-muted-foreground/80 ml-1">%</span></p>
              <p className="text-sm text-muted-foreground/80 uppercase tracking-wider mt-2 font-medium">Avg Child-Friendly</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transport Breakdown Chart */}
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle>Transport Breakdown</CardTitle>
                <CardDescription>Distribution of your tour types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transportData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="label"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                        {transportData.map((entry) => (
                          <Cell key={entry.type} fill={CHART_COLORS[entry.type] || '#6b7280'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
                  {transportData.map(item => (
                    <div key={item.type} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: CHART_COLORS[item.type] || '#6b7280' }}
                      />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-semibold text-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tours */}
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle>Recent Tours</CardTitle>
                <CardDescription>Your latest adventures</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          {/* View All Tours */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/tours")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              size="lg"
            >
              View All Tours
            </Button>
          </div>
        </motion.div>
      )}

      <CreateTourDialog
        open={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        onSubmit={handleCreateTour}
      />
    </motion.div>
  );
}
