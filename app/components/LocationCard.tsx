"use client";

/**
 * LocationCard.tsx
 *
 * A simple card displaying one saved location.
 * Shows a MapPin icon, the label, lat/lon, radius, and a remove button.
 *
 * Intentionally minimal — no dropdown menus, no edit mode.
 * The volunteering demo has a fuller version if you want to see it extended.
 */

import { MapPinIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { LocationData } from "@/app/lib/helpers/locations";

type Props = {
  location: LocationData;
  /** Called when the user clicks the card — e.g. to fly the map to this location. */
  onClick?: () => void;
  /** Called when the user clicks the remove button. */
  onRemove?: () => void;
  /** Highlights the card when it is the currently selected location. */
  isActive?: boolean;
};

export function LocationCard({ location, onClick, onRemove, isActive = false }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition
        ${isActive
          ? "border-indigo-400 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-gray-300"
        }`}
    >
      {/* Pin icon — filled when active */}
      <MapPinIcon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />

      {/* Location details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{location.label}</p>
        <p className="text-xs text-gray-500">
          {location.lat.toFixed(4)}, {location.lon.toFixed(4)} · {location.radiusKm} km radius
        </p>
      </div>

      {/* Remove button — stopPropagation so it doesn't also trigger onClick */}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${location.label}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
