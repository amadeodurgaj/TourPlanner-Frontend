import { MapPin, Timer, ArrowRight, Pencil, Trash2, Plus, Image, Upload, Star, FileDown } from "lucide-react";
import { useState, useRef } from "react";
import { cn, formatDistance, formatTime } from "@/lib/utils";
import { API_URL } from "@/api/ApiClient";
import type { Tour, TourLog } from "@/types/api";
import { ImageService } from "@/services/ImageService";
import LeafletMap from "./LeafletMap";

interface TourDetailProps {
  tour: Tour;
  onEdit: () => void;
  onDelete: () => void;
  onCreateLog: () => void;
  onImageUpload: (imagePath: string) => void;
  onDownloadReport: () => void;
  downloading?: boolean;
  downloadError?: string | null;
  logs?: TourLog[];
  onEditLog?: (log: TourLog) => void;
  onDeleteLog?: (id: string) => void;
}

export function TourDetail({ tour, onEdit, onDelete, onCreateLog, onImageUpload, onDownloadReport, downloading, downloadError, logs, onEditLog, onDeleteLog }: TourDetailProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await ImageService.uploadTourImage(tour.id, file);
      if (response.success && response.data) {
        onImageUpload(response.data);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {downloadError && (
        <div className="rounded-xl bg-destructive/10 px-5 py-4 text-sm text-destructive ring-1 ring-destructive/30">
          {downloadError}
        </div>
      )}

      {/* Header - Enhanced with better typography and spacing */}
      <div className="panel-soft flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-bold tracking-tight text-foreground mb-2">{tour.name}</h1>
          {tour.description && (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground/80">{tour.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadReport}
            disabled={downloading}
            className="icon-button hover:text-accent/80 hover:bg-accent/10"
            aria-label="Download PDF report"
          >
            <FileDown className={`w-5 h-5 ${downloading ? "animate-pulse" : ""}`} />
          </button>
          <button
            onClick={onEdit}
            className="icon-button hover:text-accent/80 hover:bg-accent/10"
            aria-label="Edit tour"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="icon-button hover:bg-destructive/15 hover:text-destructive"
            aria-label="Delete tour"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location cards - Enhanced with better visual hierarchy */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel-soft p-5 transition-smooth hover:border-border/80">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2 font-medium">From Location</p>
          <p className="text-lg text-foreground font-medium flex items-center gap-3">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="truncate">{tour.fromLocation}</span>
          </p>
        </div>
        <div className="panel-soft p-5 transition-smooth hover:border-border/80">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2 font-medium">To Location</p>
          <p className="text-lg text-foreground font-medium flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="truncate">{tour.toLocation}</span>
          </p>
        </div>
      </div>

      {/* Stats - Enhanced with better visual presentation */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel-soft p-5">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2 font-medium">Distance</p>
          <p className="text-2xl font-bold text-foreground tabular-nums text-accent">{formatDistance(tour.distance)}</p>
        </div>
        <div className="panel-soft p-5">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2 font-medium">Estimated Time</p>
          <p className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Timer className="w-6 h-6 text-accent/80" />
            <span className="tabular-nums">{tour.estimatedTime || "Not set"}</span>
          </p>
        </div>
      </div>

      {/* Transport - Enhanced styling */}
      <div className="panel-soft p-5">
        <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3 font-medium">Transport Type</p>
        <span className="inline-flex rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-2 text-lg font-semibold capitalize text-accent ring-1 ring-accent/25 shadow-soft">
          {tour.transportType}
        </span>
      </div>

      {/* Scores - Enhanced with better progress bars */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel-soft p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-success" />
            <p className="text-sm text-muted-foreground/70 uppercase tracking-wider font-medium">Popularity Score</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-muted/80 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out shadow-soft"
                style={{
                  width: `${tour.popularityScore}%`,
                  background: tour.popularityScore >= 60 ? "linear-gradient(90deg, var(--color-success), var(--color-success)/80)" : 
                           tour.popularityScore >= 20 ? "linear-gradient(90deg, var(--color-warning), var(--color-warning)/80)" :
                           "linear-gradient(90deg, var(--color-muted-foreground), var(--color-muted-foreground)/60)"
                }}
              />
            </div>
            <span className="text-2xl font-bold text-foreground tabular-nums">{tour.popularityScore}%</span>
          </div>
        </div>
        <div className="panel-soft p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground/70 uppercase tracking-wider font-medium">Child-Friendly</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full bg-muted/80 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out shadow-soft"
                style={{
                  width: `${tour.childFriendliness}%`,
                  background: tour.childFriendliness >= 60 ? "linear-gradient(90deg, var(--color-accent), var(--color-accent)/80)" : 
                           tour.childFriendliness >= 20 ? "linear-gradient(90deg, var(--color-warning), var(--color-warning)/80)" :
                           "linear-gradient(90deg, var(--color-muted-foreground), var(--color-muted-foreground)/60)"
                }}
              />
            </div>
            <span className="text-2xl font-bold text-foreground tabular-nums">{tour.childFriendliness}%</span>
          </div>
        </div>
      </div>

      {/* Image - Enhanced with better visual presentation */}
      <div className="panel-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-foreground">Tour Image</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary px-4 py-2 text-sm hover:bg-accent/10 hover:text-accent"
          >
            {uploading ? (
              <span className="spinner-sm" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
          </button>
        </div>
        {tour.imagePath ? (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted/80 ring-1 ring-border/70 shadow-medium">
            <img
              src={`${API_URL}${tour.imagePath}`}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-secondary/80">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <Image className="w-6 h-6 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium text-muted-foreground/80">No image uploaded</p>
              <p className="text-xs text-muted-foreground/60 mt-1.5">Click upload to add a photo</p>
            </div>
          </div>
        )}
      </div>

      {/* Map - Enhanced styling */}
      <div className="panel-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-foreground">Route Map</p>
        </div>
        {tour.fromLatitude && tour.fromLongitude && tour.toLatitude && tour.toLongitude ? (
          <div className="rounded-xl overflow-hidden shadow-medium">
            <LeafletMap
              fromLat={tour.fromLatitude}
              fromLng={tour.fromLongitude}
              toLat={tour.toLatitude}
              toLng={tour.toLongitude}
              height="350px"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-secondary/80">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <MapPin className="w-6 h-6 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium text-muted-foreground/80">Map not available</p>
              <p className="text-xs text-muted-foreground/60 mt-1.5">Add coordinates to see the route</p>
            </div>
          </div>
        )}
      </div>

      {/* Tour Logs - Enhanced section header */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-foreground">Tour Logs</h2>
          <button
            onClick={onCreateLog}
            className="btn-primary px-4 py-2.5 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Log
          </button>
        </div>

        {logs && logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="panel-soft p-4 transition-smooth hover:border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">
                        {log.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(log.dateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Timer className="w-4 h-4" />
                        <span className="tabular-nums">{formatTime(log.totalTime)}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="tabular-nums">{formatDistance(log.totalDistance)}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <span className="tabular-nums">{log.rating}/5</span>
                      </span>
                    </div>
                    {log.comment && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {log.comment}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    {onEditLog && (
                      <button
                        onClick={() => onEditLog(log)}
                        className="rounded-md p-1.5 text-muted-foreground transition-smooth hover:bg-accent/10 hover:text-accent"
                        aria-label="Edit log"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteLog && (
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="rounded-md p-1.5 text-muted-foreground transition-smooth hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel-soft flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No logs yet for this tour</p>
            <button
              onClick={onCreateLog}
              className="btn-secondary mt-3 text-accent"
            >
              <Plus className="w-4 h-4" />
              Add First Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TourDetail;
