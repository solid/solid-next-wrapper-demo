/**
 * LocationDataset.ts
 *
 * A DatasetWrapper wraps an entire RDF dataset and lets you query it.
 *
 * subjectsOf(predicate, Constructor) finds every subject that has
 * the given predicate, then wraps each one in the given TermWrapper class.
 *
 * Example: given the Turtle:
 *   _:loc1 urn:demo/label "London Bridge" .
 *   _:loc2 urn:demo/label "Tower Hill" .
 *
 * subjectsOf(DEMO.label, Location) returns two Location instances —
 * one for _:loc1 and one for _:loc2.
 */

import { DatasetWrapper } from "@rdfjs/wrapper";
import { Location } from "./Location";
import { DEMO } from "./Vocabulary";

export class LocationDataset extends DatasetWrapper {
  /**
   * Returns all Location subjects in the dataset —
   * i.e. every blank node / named node that has a urn:demo/label triple.
   */
  get locations(): Iterable<Location> {
    return this.subjectsOf(DEMO.label, Location);
  }
}
