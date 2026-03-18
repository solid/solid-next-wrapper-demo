import { Item } from "./Item";
import { ObjectMapping, TermWrapper } from "rdfjs-wrapper";

export class List extends TermWrapper {
    get item(): Set<Item> {
        return this.objects("urn:example:/item", ObjectMapping.as(Item), ObjectMapping.as(Item));
    }
}
