import { MapPin, Timer, ArrowRight, Pencil, Trash2, Plus, Image, Upload, X } from "lucide-react";
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
  logs?: TourLog[];
  onEditLog?: (log: TourLog) => void;
  onDeleteLog?: (id: string) => void;
}

export function TourDetail({ tour, onEdit, onDelete, onCreateLog, onImageUpload, logs, onEditLog, onDeleteLog }: TourDetailProps) {
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary">{tour.name}</h2>
          <p className="text-sm text-muted mt-1">{tour.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-primary border border-border/50">
          <p className="text-xs text-muted-light uppercase tracking-wider mb-1">From</p>
          <p className="text-sm text-secondary font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            {tour.fromLocation}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-primary border border-border/50">
          <p className="text-xs text-muted-light uppercase tracking-wider mb-1">To</p>
          <p className="text-sm text-secondary font-medium flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
            {tour.toLocation}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-primary border border-border/50">
          <p className="text-xs text-muted-light uppercase tracking-wider mb-1">Distance</p>
          <p className="text-lg font-semibold text-secondary">{formatDistance(tour.distance)}</p>
        </div>
        <div className="p-4 rounded-xl bg-primary border border-border/50">
          <p className="text-xs text-muted-light uppercase tracking-wider mb-1">Est. Time</p>
          <p className="text-lg font-semibold text-secondary flex items-center gap-2">
            <Timer className="w-4 h-4 text-accent" />
            {tour.estimatedTime || "—"}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary border border-border/50">
        <p className="text-xs text-muted-light uppercase tracking-wider mb-2">Transport</p>
        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-accent/15 text-accent capitalize">
          {tour.transportType}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-primary border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-secondary">Tour Image</p>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
        {tour.imagePath ? (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={`${API_URL}${tour.imagePath}`}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-primary border border-dashed border-border/50 flex items-center justify-center">
            <div className="text-center">
              <Image className="w-8 h-8 text-muted-light mx-auto mb-2" />
              <p className="text-sm text-muted-light">No image uploaded</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-primary border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-secondary">Map</p>
        </div>
        {tour.fromLatitude && tour.fromLongitude && tour.toLatitude && tour.toLongitude ? (
            <LeafletMap
                fromLat={tour.fromLatitude}
                fromLng={tour.fromLongitude}
                toLat={tour.toLatitude}
                toLng={tour.toLongitude}
                height="300px"
            />
        ) : (
            <div className="aspect-video rounded-lg bg-primary border border-dashed border-border/50 flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-light mx-auto mb-2" />
                    <p className="text-sm text-muted-light">Map not available</p>
                    <p className="text-xs text-muted-light mt-1">Location coordinates missing</p>
                </div>
            </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary">Tour Logs</h3>
        <button
          onClick={onCreateLog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-primary hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Log
        </button>
      </div>

      {logs && logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-primary border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent font-medium">
                      {log.difficulty}
                    </span>
                    <span className="text-xs text-muted-light">
                      {new Date(log.dateTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(log.totalTime)}
                    </span>
                    <span className="flex items-center gap-1 text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {formatDistance(log.totalDistance)}
                    </span>
                    <span className="flex items-center gap-1 text-muted">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      {log.rating}/5
                    </span>
                  </div>
                  {log.comment && (
                    <p className="mt-2 text-sm text-muted-light">
                      {log.comment}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {onEditLog && (
                    <button
                      onClick={() => onEditLog(log)}
                      className="p-1.5 rounded text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteLog && (
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors"
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
        <div className="text-center py-8">
          <p className="text-sm text-muted-light">No logs yet for this tour.</p>
          <button
            onClick={onCreateLog}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Log
          </button>
        </div>
      )}
    </div>
  );
}

export default TourDetail;