import { LiteralAs, LiteralFrom, NamedNodeAs, NamedNodeFrom, TermWrapper } from "@rdfjs/wrapper";

export class Item extends TermWrapper {
    get id(): string {
        return this.value;
    }

    get thumbnail(): string | undefined {
        return this.singularNullable("urn:example:/thumbnail", NamedNodeAs.string);
    }

    set thumbnail(value: string | undefined) {
        this.overwriteNullable("urn:example:/thumbnail", value, NamedNodeFrom.string);
    }

    get name(): string | undefined {
        return this.singularNullable("urn:example:/name", LiteralAs.string);
    }

    set name(value: string | undefined) {
        this.overwriteNullable("urn:example:/name", value, LiteralFrom.string);
    }

    get featured(): boolean | undefined {
        return this.singularNullable("urn:example:/featured", LiteralAs.boolean);
    }

    set featured(value: boolean | undefined) {
        this.overwriteNullable("urn:example:/featured", value, LiteralFrom.boolean);
    }

    get description(): string | undefined {
        return this.singularNullable("urn:example:/description", LiteralAs.string);
    }

    set description(value: string | undefined) {
        this.overwriteNullable("urn:example:/description", value, LiteralFrom.string);
    }

    get website(): string | undefined {
        return this.singularNullable("urn:example:/website", NamedNodeAs.string);
    }

    set website(value: string | undefined) {
        this.overwriteNullable("urn:example:/website", value, NamedNodeFrom.string);
    }
}
