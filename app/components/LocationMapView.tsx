"use client";

/**
 * LocationMapView.tsx
 *
 * The actual Leaflet map — rendered client-side only (see Map.tsx for why).
 *
 * Key Leaflet + react-leaflet concepts used here:
 *   MapContainer   — mounts the Leaflet map into the DOM
 *   TileLayer      — loads the OpenStreetMap tile images
 *   Marker + Popup — a pin with an optional label tooltip
 *   Circle         — a filled radius circle around the center point
 *   useMap()       — gives access to the Leaflet map instance inside a component
 *   useMapEvents() — subscribes to Leaflet map events (e.g. click)
 *
 * leaflet-defaulticon-compatibility fixes broken marker icons in Next.js
 * (webpack rewrites asset paths, which breaks Leaflet's default icon detection).
 */

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";

export type MapMarker = { lat: number; lon: number; label?: string };

export type LocationMapViewProps = {
  className?: string;
  /** Markers to show on the map. */
  markers?: MapMarker[];
  /** When set, map smoothly flies to this center. */
  center?: [number, number] | null;
  /** Radius in km drawn around center. */
  radiusKm?: number | null;
  /** Called when the user clicks the map — used to add a location. */
  onMapClick?: (lat: number, lon: number) => void;
  /** Small hint overlay text, e.g. "Click to add a location". */
  hint?: string;
};

/** Listens for click events on the map and calls onMapClick. */
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Watches the `center` prop and smoothly flies the map there when it changes. */
function MapCenterUpdater({ center }: { center: [number, number] | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (center != null) map.flyTo(center, 12, { duration: 0.5 });
  }, [map, center]);
  return null;
}

/** +/− zoom buttons — replaces Leaflet's default control for consistent styling. */
function ZoomControl() {
  const map = useMap();
  return (
    <div className="absolute left-2 top-2 z-[1000] flex flex-col gap-0.5 rounded border border-gray-200 bg-white p-0.5 shadow-sm">
      <button type="button" aria-label="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-gray-100"
        onClick={() => map.zoomIn()}>+</button>
      <button type="button" aria-label="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-gray-100"
        onClick={() => map.zoomOut()}>−</button>
    </div>
  );
}

export function LocationMapView({
  className = "",
  markers = [],
  center,
  radiusKm,
  onMapClick,
  hint,
}: LocationMapViewProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      <MapContainer
        center={[51.505, -0.09]}   // default: London
        zoom={6}
        className="h-full w-full rounded-md"
        style={{ minHeight: 300 }}
        zoomControl={false}        // we render our own ZoomControl below
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl />
        <MapCenterUpdater center={center} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Render a pin + popup for each saved location */}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}

        {/* Draw a radius circle when a center point is active */}
        {center != null && radiusKm != null && radiusKm > 0 && (
          <Circle
            center={center}
            radius={radiusKm * 1000}   // Leaflet uses metres
            pathOptions={{ color: "#6366f1", fillOpacity: 0.1 }}
          />
        )}
      </MapContainer>

      {hint && (
        <p className="absolute right-2 top-2 z-[1000] rounded bg-white px-2 py-1 text-xs text-gray-500 shadow">
          {hint}
        </p>
      )}
    </div>
  );
}
