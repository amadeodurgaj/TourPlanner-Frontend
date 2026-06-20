import { Link } from "react-router-dom";
import { ArrowRight, Clock, Images, Map, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section - Enhanced with better visual hierarchy and animations */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Logo/Icon - Enhanced with gradient background */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 ring-1 ring-accent/20 shadow-lg">
            <MapPin className="w-10 h-10 text-accent" />
          </div>

          {/* Main Headline - Enhanced with better typography */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
            Plan your next{" "}
            <span className="text-gradient">adventure</span>
          </h1>

          {/* Subheadline - Enhanced styling */}
          <p className="text-xl text-muted-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Track your tours, log your experiences, and discover new routes.
            Your personal travel companion.
          </p>

          {/* CTA Buttons - Enhanced with better spacing and shadows */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 active-press"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary px-8 py-4 border-border/80 hover:border-accent/40"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with better visual design */}
      <section className="border-t border-border/60 bg-secondary/50 px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why You'll Love TourPlanner
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Feature 1 - Track Routes */}
            <div className="panel-soft p-7 text-center hover-lift transition-smooth">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/20">
                <Map className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Track Routes</h3>
              <p className="text-base text-muted-foreground/80 leading-relaxed">
                Map your journeys with detailed route information and location data.
              </p>
            </div>

            {/* Feature 2 - Log Experiences */}
            <div className="panel-soft p-7 text-center hover-lift transition-smooth">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 ring-1 ring-success/20">
                <Clock className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Log Experiences</h3>
              <p className="text-base text-muted-foreground/80 leading-relaxed">
                Record distance, time, difficulty, and your personal rating for each tour.
              </p>
            </div>

            {/* Feature 3 - Upload Photos */}
            <div className="panel-soft p-7 text-center hover-lift transition-smooth">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-warning/15 to-warning/5 ring-1 ring-warning/20">
                <Images className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Upload Photos</h3>
              <p className="text-base text-muted-foreground/80 leading-relaxed">
                Add photos to your tours and create a visual travel diary.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
