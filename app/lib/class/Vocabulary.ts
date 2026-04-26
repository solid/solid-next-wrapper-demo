/**
 * Vocabulary.ts
 *
 * Defines the RDF predicate IRIs used in this demo.
 * Using a short "urn:demo/" namespace keeps the Turtle readable
 * during a live demo — no long URLs to explain.
 *
 * In a real app you would use an established vocabulary
 * like schema.org or geo: instead.
 */

export const DEMO = {
  /** The human-readable name of a location, e.g. "London Bridge" */
  label: "urn:demo/label",

  /** WGS84 latitude as a decimal string */
  lat: "urn:demo/lat",

  /** WGS84 longitude as a decimal string */
  lon: "urn:demo/lon",

  /** Deployment radius in kilometres */
  radiusKm: "urn:demo/radiusKm",
} as const;
