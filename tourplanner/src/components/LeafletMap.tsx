import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
    height?: string;
}

export function LeafletMap({ fromLat, fromLng, toLat, toLng, height = "300px" }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        // Fix for Leaflet's default icon issue with Webpack
        const defaultIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            }).addTo(mapInstance.current);
        }

        // Clear existing markers and routes
        if (mapInstance.current) {
            mapInstance.current.eachLayer(layer => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    mapInstance.current?.removeLayer(layer);
                }
            });
        }

        // Add markers and route if coordinates are available
        if (fromLat && fromLng && toLat && toLng && mapInstance.current) {
            const fromMarker = L.marker([fromLat, fromLng], { icon: defaultIcon })
                .addTo(mapInstance.current)
                .bindPopup("Start: " + fromLat.toFixed(4) + ", " + fromLng.toFixed(4));

            const toMarker = L.marker([toLat, toLng], { icon: defaultIcon })
                .addTo(mapInstance.current)
                .bindPopup("End: " + toLat.toFixed(4) + ", " + toLng.toFixed(4));

            // Draw route line
            const routeLine = L.polyline([
                [fromLat, fromLng],
                [toLat, toLng]
            ], { color: "#3b82f6", weight: 4, opacity: 0.7 }).addTo(mapInstance.current);

            // Fit map to show both markers
            const group = L.featureGroup([fromMarker, toMarker]);
            mapInstance.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [fromLat, fromLng, toLat, toLng]);

    return (
        <div
            ref={mapRef}
            style={{ height, width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}
            className="border border-border/50"
        />
    );
}

export default LeafletMap;
