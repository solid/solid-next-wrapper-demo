"use client";

/**
 * LocationEditor.tsx
 *
 * The authenticated editor — shows:
 *   - A map (click to pick a location)
 *   - A label input
 *   - A radius slider
 *   - An "Add location" button
 *   - A list of saved LocationCards with remove buttons
 *
 * This component receives authFetch from the parent (passed in from useAuth).
 * All pod writes go through authFetch so they carry DPoP auth headers.
 */

import { useState } from "react";
import { Map } from "@/app/components/Map";
import { LocationCard } from "@/app/components/LocationCard";
import { useLocations } from "@/app/lib/hooks/useLocations";

type Props = {
  /** Authenticated fetch from useAuth — required for writing to the pod. */
  authFetch: typeof fetch;
};

export function LocationEditor({ authFetch }: Props) {
  const { locations, isLoading, error, addLocation, removeLocation } = useLocations(authFetch);

  // The lat/lon the user last clicked on the map
  const [picked, setPicked] = useState<{ lat: number; lon: number } | null>(null);
  // Which card is currently highlighted (flies the map to that location)
  const [activeId, setActiveId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);

  // The map center: if a card is active use that location, otherwise use the picked point
  const activeLocation = locations.find((l) => l.id === activeId);
  const mapCenter = activeLocation
    ? ([activeLocation.lat, activeLocation.lon] as [number, number])
    : picked
      ? ([picked.lat, picked.lon] as [number, number])
      : null;

  async function handleAdd() {
    if (!picked) return;
    await addLocation({ label: label || "Unnamed", lat: picked.lat, lon: picked.lon, radiusKm });
    // Reset the form after adding
    setPicked(null);
    setLabel("");
    setRadiusKm(10);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Map — click to pick a point */}
      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
        <Map
          markers={locations.map((l) => ({ lat: l.lat, lon: l.lon, label: l.label }))}
          center={mapCenter}
          radiusKm={picked ? radiusKm : null}
          onMapClick={(lat, lon) => { setPicked({ lat, lon }); setActiveId(null); }}
          hint="Click the map to pick a location"
        />
      </div>

      {/* Add form — only shown once a point is picked */}
      {picked && (
        <div className="flex flex-col gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-sm font-medium text-indigo-700">
            Selected: {picked.lat.toFixed(4)}, {picked.lon.toFixed(4)}
          </p>
          <input
            type="text"
            placeholder="Location label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 w-24">Radius: {radiusKm} km</label>
            <input
              type="range" min={1} max={100} value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add location
          </button>
        </div>
      )}

      {/* Saved locations list */}
      {isLoading && <p className="text-sm text-gray-400">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-col gap-2">
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            isActive={activeId === loc.id}
            onClick={() => setActiveId(activeId === loc.id ? null : loc.id)}
            onRemove={() => removeLocation(loc.id)}
          />
        ))}
        {!isLoading && locations.length === 0 && (
          <p className="text-sm text-gray-400">No locations saved yet. Click the map to add one.</p>
        )}
      </div>
    </div>
  );
}
