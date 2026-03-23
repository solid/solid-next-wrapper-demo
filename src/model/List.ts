import { Item } from "./Item";
import { TermAs, TermFrom, TermWrapper } from "@rdfjs/wrapper";

export class List extends TermWrapper {
    get item(): Set<Item> {
        return this.objects("urn:example:/item", TermAs.instance(Item), TermFrom.instance);
    }
}
