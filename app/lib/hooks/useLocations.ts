"use client";

/**
 * useLocations.ts
 *
 * Manages the locations array in React state and wires up save/delete.
 *
 * Pattern:
 *   1. On mount, call fetchLocations() to load from the pod
 *   2. addLocation / removeLocation update local state immediately (optimistic)
 *      then call saveLocations() to persist the full array to the pod via PUT
 *
 * Why PUT the whole file instead of patching?
 *   Simpler to reason about — the pod file always matches the React state exactly.
 *   For a demo this is fine; a production app might use PATCH instead.
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchLocations,
  saveLocations,
  type LocationData,
} from "@/app/lib/helpers/locations";

export type UseLocationsResult = {
  locations: LocationData[];
  isLoading: boolean;
  error: string | null;
  addLocation: (loc: Omit<LocationData, "id">) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
};

export function useLocations(authFetch: typeof fetch): UseLocationsResult {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load locations from the pod on mount
  useEffect(() => {
    fetchLocations(authFetch)
      .then(setLocations)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [authFetch]);

  const addLocation = useCallback(
    async (loc: Omit<LocationData, "id">) => {
      // Generate a stable id from coordinates so the list key is meaningful
      const id = `${loc.lat.toFixed(5)},${loc.lon.toFixed(5)}`;
      const next = [...locations, { ...loc, id }];
      setLocations(next);                        // optimistic update
      await saveLocations(next, authFetch);      // persist to pod
    },
    [locations, authFetch],
  );

  const removeLocation = useCallback(
    async (id: string) => {
      const next = locations.filter((l) => l.id !== id);
      setLocations(next);                        // optimistic update
      await saveLocations(next, authFetch);      // persist to pod
    },
    [locations, authFetch],
  );

  return { locations, isLoading, error, addLocation, removeLocation };
}
