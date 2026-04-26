/**
 * page.tsx — Public home page (Server Component)
 *
 * Fetches locations from the pod at request time (no auth — public read).
 * Renders a static map with pins + a list of location cards.
 *
 * The "Edit locations" link goes to /edit which requires login.
 *
 * export const dynamic = "force-dynamic" tells Next.js not to cache this
 * page at build time — so it always shows the latest pod data.
 */

import { fetchLocations } from "@/app/lib/helpers/locations";
import { Map } from "@/app/components/Map";
import { LocationCard } from "@/app/components/LocationCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Public fetch — no auth needed, CSS pod allows public reads
  const locations = await fetchLocations().catch(() => []);

  const markers = locations.map((l) => ({ lat: l.lat, lon: l.lon, label: l.label }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solid Locations Demo</h1>
          <p className="text-sm text-gray-500">Locations stored in a Solid pod as Turtle RDF</p>
        </div>
        <Link
          href="/edit"
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-indigo-700"
        >
          Edit locations
        </Link>
      </div>

      {/* Map showing all saved locations */}
      <div className="mb-6 h-72 w-full overflow-hidden rounded-lg border border-gray-200">
        <Map markers={markers} />
      </div>

      {/* Location cards — read-only, no remove button */}
      <div className="flex flex-col gap-2">
        {locations.length === 0 ? (
          <p className="text-sm text-gray-400">
            No locations yet.{" "}
            <Link href="/edit" className="text-indigo-600">Add one →</Link>
          </p>
        ) : (
          locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))
        )}
      </div>
    </main>
  );
}
