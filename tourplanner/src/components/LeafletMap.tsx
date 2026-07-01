import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
    routeGeometry?: string | null;
    height?: string;
}

function decodePolyline(encoded: string): [number, number][] {
    const coords: [number, number][] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
        let shift = 0;
        let result = 0;
        let byte: number;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        coords.push([lat / 1e5, lng / 1e5]);
    }

    return coords;
}

export function LeafletMap({ fromLat, fromLng, toLat, toLng, routeGeometry, height = "300px" }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
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

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            }).addTo(mapInstance.current);
        }

        if (mapInstance.current) {
            mapInstance.current.eachLayer(layer => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    mapInstance.current?.removeLayer(layer);
                }
            });
        }

        if (fromLat && fromLng && toLat && toLng && mapInstance.current) {
            const fromMarker = L.marker([fromLat, fromLng], { icon: defaultIcon })
                .addTo(mapInstance.current)
                .bindPopup("Start: " + fromLat.toFixed(4) + ", " + fromLng.toFixed(4));

            const toMarker = L.marker([toLat, toLng], { icon: defaultIcon })
                .addTo(mapInstance.current)
                .bindPopup("End: " + toLat.toFixed(4) + ", " + toLng.toFixed(4));

            let routeCoords: [number, number][] = [];

            if (routeGeometry) {
                routeCoords = decodePolyline(routeGeometry);
            }

            let routeLine: L.Polyline;

            if (routeCoords.length > 0) {
                routeLine = L.polyline(routeCoords, {
                    color: "#3b82f6",
                    weight: 4,
                    opacity: 0.7
                }).addTo(mapInstance.current);
            } else {
                routeLine = L.polyline([
                    [fromLat, fromLng],
                    [toLat, toLng]
                ], { color: "#3b82f6", weight: 4, opacity: 0.7 }).addTo(mapInstance.current);
            }

            const allCoords: [number, number][] = routeCoords.length > 0
                ? routeCoords
                : [[fromLat, fromLng], [toLat, toLng]];

            const bounds = L.latLngBounds(allCoords);
            mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [fromLat, fromLng, toLat, toLng, routeGeometry]);

    return (
        <div
            ref={mapRef}
            style={{ height, width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}
            className="relative z-0 border border-border/50"
        />
    );
}

export default LeafletMap;
