"use client";

/**
 * Map.tsx
 *
 * A Next.js dynamic import wrapper around LocationMapView.
 *
 * WHY this file exists:
 *   Leaflet accesses `window` and `document` on import — those don't exist
 *   during Next.js server-side rendering (SSR), which would crash the build.
 *
 *   `dynamic(..., { ssr: false })` tells Next.js to skip this component
 *   during SSR and only load it in the browser.
 *
 *   This is the standard pattern for any browser-only library in Next.js.
 *   The volunteering demo uses the same approach.
 */

import dynamic from "next/dynamic";
import type { LocationMapViewProps } from "./LocationMapView";

export type { LocationMapViewProps, MapMarker } from "./LocationMapView";

// Dynamically import the real map — ssr: false prevents the server from
// ever importing Leaflet, keeping the SSR build safe.
const LocationMapView = dynamic(
  () => import("./LocationMapView").then((m) => m.LocationMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-400">Loading map…</span>
      </div>
    ),
  },
);

/** Drop-in component — use this everywhere instead of importing LocationMapView directly. */
export function Map(props: LocationMapViewProps) {
  return <LocationMapView {...props} />;
}
