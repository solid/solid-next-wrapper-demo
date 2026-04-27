/**
 * locations.ts
 *
 * Two public functions:
 *   fetchLocations(fetchFn?) — GET locations.ttl, parse, wrap, return Location[]
 *   saveLocations(locations, fetchFn) — build quads, serialize to Turtle, PUT
 *
 * The optional fetchFn parameter is how Solid auth works:
 *   - Public reads:  pass nothing → uses browser fetch (no auth)
 *   - Authed writes: pass getDefaultSession().fetch → adds DPoP auth headers
 */

import * as N3 from "n3";
import { LocationDataset } from "../class/LocationDataset";
import { DEMO } from "../class/Vocabulary";

// ── Helpers ───────────────────────────────────────────────────────────────

/** Builds the full URL to locations.ttl from env vars. */
function locationsUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URI!;
  const path = process.env.NEXT_PUBLIC_MANIFEST_RESOURCE_URI!;
  return new URL(path, base).toString();
}

/** Parses a Turtle string into an N3 Store (the RDF/JS DatasetCore). */
function parseTurtle(turtle: string): N3.Store {
  const store = new N3.Store();
  store.addQuads(new N3.Parser().parse(turtle));
  return store;
}

/** Serializes every quad in a Store back to a Turtle string. */
function serializeToTurtle(store: N3.Store): Promise<string> {
  // N3 Writer outputs valid Turtle with a urn:demo/ prefix for readability
  const writer = new N3.Writer({ prefixes: { demo: "urn:demo/" } });
  for (const q of store.getQuads(null, null, null, null)) writer.addQuad(q);
  return new Promise((resolve, reject) => {
    writer.end((err, result) => (err ? reject(err) : resolve(result ?? "")));
  });
}

// ── Public API ────────────────────────────────────────────────────────────

export type LocationData = {
  id: string;       // blank node ID — used as a stable React key
  label: string;
  lat: number;
  lon: number;
  radiusKm: number;
};

/**
 * Fetches locations.ttl from the CSS pod, parses it, and returns a plain array.
 * Pass an authenticated fetch (getDefaultSession().fetch) for private pods.
 */
export async function fetchLocations(fetchFn: typeof fetch = fetch): Promise<LocationData[]> {
  const res = await fetchFn(locationsUrl(), {
    headers: { Accept: "text/turtle" },
  });

  if (res.status === 404) return []; // empty pod — not an error
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);

  const turtle = await res.text();
  if (!turtle.trim()) return [];

  // Wrap the parsed store with our LocationDataset — gives us the .locations getter
  const store = parseTurtle(turtle);
  const dataset = new LocationDataset(store, N3.DataFactory);

  return [...dataset.locations]
    .filter((loc) => loc.lat != null && loc.lon != null)
    .map((loc) => ({
      id: loc.value,                       // the blank node's internal value
      label: loc.label ?? "",
      lat: loc.lat!,
      lon: loc.lon!,
      radiusKm: loc.radiusKm ?? 10,
    }));
}

/**
 * Writes the full locations array to locations.ttl via authenticated PUT.
 * Replaces the entire file — simpler than diffing for a demo.
 */
export async function saveLocations(
  locations: LocationData[],
  fetchFn: typeof fetch,
): Promise<void> {
  const store = new N3.Store();
  const { blankNode, namedNode, literal } = N3.DataFactory;

  for (const loc of locations) {
    // Each location becomes a blank node with four predicates:
    //   _:b0 urn:demo/label "London Bridge" .
    //   _:b0 urn:demo/lat "51.5" .  etc.
    const bnode = blankNode();
    store.addQuad(bnode, namedNode(DEMO.label),    literal(loc.label));
    store.addQuad(bnode, namedNode(DEMO.lat),      literal(String(loc.lat)));
    store.addQuad(bnode, namedNode(DEMO.lon),      literal(String(loc.lon)));
    store.addQuad(bnode, namedNode(DEMO.radiusKm), literal(String(loc.radiusKm)));
  }

  const turtle = await serializeToTurtle(store);
  const res = await fetchFn(locationsUrl(), {
    method: "PUT",
    headers: { "Content-Type": "text/turtle" },
    body: turtle,
  });

  if (!res.ok) throw new Error(`Failed to save locations: ${res.status}`);
}
