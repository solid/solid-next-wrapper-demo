/**
 * Location.ts
 *
 * A TermWrapper wraps a single RDF subject and gives it typed getters/setters.
 *
 * In @rdfjs/wrapper v0.33, we use two static helpers instead of instance methods:
 *
 *   OptionalFrom.subjectPredicate(this, predicate, coercion)
 *     → looks up: <subject> <predicate> ?value  (returns T | undefined)
 *
 *   OptionalAs.object(this, predicate, value, coercion)
 *     → writes:   <subject> <predicate> <value>  (replaces any existing triple)
 */

import { TermWrapper, LiteralAs, LiteralFrom, OptionalFrom, OptionalAs } from "@rdfjs/wrapper";
import { DEMO } from "./Vocabulary";

export class Location extends TermWrapper {
  // ── Getters ──────────────────────────────────────────────

  get label(): string | undefined {
    // Read the urn:demo/label triple as a plain string
    return OptionalFrom.subjectPredicate(this, DEMO.label, LiteralAs.string);
  }

  get lat(): number | undefined {
    const v = OptionalFrom.subjectPredicate(this, DEMO.lat, LiteralAs.string);
    // Stored as a string literal in Turtle; parse to float for JS use
    return v != null ? parseFloat(v) : undefined;
  }

  get lon(): number | undefined {
    const v = OptionalFrom.subjectPredicate(this, DEMO.lon, LiteralAs.string);
    return v != null ? parseFloat(v) : undefined;
  }

  get radiusKm(): number | undefined {
    const v = OptionalFrom.subjectPredicate(this, DEMO.radiusKm, LiteralAs.string);
    return v != null ? parseFloat(v) : undefined;
  }

  // ── Setters ──────────────────────────────────────────────

  set label(value: string) {
    // Write the urn:demo/label triple — LiteralFrom.string creates an xsd:string literal
    OptionalAs.object(this, DEMO.label, value, LiteralFrom.string);
  }

  set lat(value: number) {
    // Store as string literal so Turtle output is human-readable ("51.5")
    OptionalAs.object(this, DEMO.lat, String(value), LiteralFrom.string);
  }

  set lon(value: number) {
    OptionalAs.object(this, DEMO.lon, String(value), LiteralFrom.string);
  }

  set radiusKm(value: number) {
    OptionalAs.object(this, DEMO.radiusKm, String(value), LiteralFrom.string);
  }
}
