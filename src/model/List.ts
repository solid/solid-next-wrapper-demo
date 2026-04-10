import { Item } from "./Item";
import { SetFrom, TermAs, TermFrom, TermWrapper } from "@rdfjs/wrapper";

export class List extends TermWrapper {
    get item(): Set<Item> {
        return SetFrom.subjectPredicate(this, "urn:example:/item", TermAs.instance(Item), TermFrom.instance);
    }
}
