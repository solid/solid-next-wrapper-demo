import * as N3 from "n3";
import type * as RdfJs from "@rdfjs/types";
import { List } from "./model/List";
import { Config } from "./Config";

/**
 * This fetches the resource manifest
 * The resource manifest holds links to all list items
 */
export async function fetchList(): Promise<List> {
    // Construct a URL for the Solid resource.
    // Use a base URI (like http://example.com/some-path/) separate from the
    // local part (like file.ext)
    const uri = new URL(Config.manifestResourceUri, Config.baseUri);

    // We accept well known RDF syntax; turtle is a common default
    const response = await fetch(uri, {
        headers: {
            Accept: "text/turtle, application/trig, application/n-triples, application/n-quads, text/n3",
        },
    });

    // In case we were not able to fetch the manifest resource, bail out.
    // Serious exception handling and network resilience are out of scope for this demo.
    if (!response.ok) {
        throw new Error("Failed to fetch list");
    }

    const rdf = await response.text();

    // Convert Raw RDF into a JavaScript object.
    const dataset = parseRdf(rdf);

    return new List("urn:example:list", dataset, N3.DataFactory);
}

function parseRdf(rdf: string): RdfJs.DatasetCore {
    const store = new N3.Store();
    store.addQuads(new N3.Parser().parse(rdf));

    return store;
}
