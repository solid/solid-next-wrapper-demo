import {
    LiteralAs,
    LiteralFrom,
    NamedNodeAs,
    NamedNodeFrom,
    OptionalAs,
    OptionalFrom,
    TermWrapper
} from "@rdfjs/wrapper";

export class Item extends TermWrapper {
    get id(): string {
        return this.value;
    }

    get thumbnail(): string | undefined {
        return OptionalFrom.subjectPredicate(this, "urn:example:/thumbnail", NamedNodeAs.string);
    }

    set thumbnail(value: string | undefined) {
        OptionalAs.object(this, "urn:example:/thumbnail", value, NamedNodeFrom.string);
    }

    get name(): string | undefined {
        return OptionalFrom.subjectPredicate(this, "urn:example:/name", LiteralAs.string);
    }

    set name(value: string | undefined) {
        OptionalAs.object(this, "urn:example:/name", value, LiteralFrom.string);
    }

    get featured(): boolean | undefined {
        return OptionalFrom.subjectPredicate(this, "urn:example:/featured", LiteralAs.boolean);
    }

    set featured(value: boolean | undefined) {
        OptionalAs.object(this, "urn:example:/featured", value, LiteralFrom.boolean);
    }

    get description(): string | undefined {
        return OptionalFrom.subjectPredicate(this, "urn:example:/description", LiteralAs.string);
    }

    set description(value: string | undefined) {
        OptionalAs.object(this, "urn:example:/description", value, LiteralFrom.string);
    }

    get website(): string | undefined {
        return OptionalFrom.subjectPredicate(this, "urn:example:/website", NamedNodeAs.string);
    }

    set website(value: string | undefined) {
        OptionalAs.object(this, "urn:example:/website", value, NamedNodeFrom.string);
    }
}
