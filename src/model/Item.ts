import { TermMapping, TermWrapper, ValueMapping } from "rdfjs-wrapper";

export class Item extends TermWrapper {
    get id(): string {
        return this.value;
    }

    get thumbnail(): string | undefined {
        return this.singularNullable("urn:example:/thumbnail", ValueMapping.iriToString);
    }

    set thumbnail(value: string | undefined) {
        this.overwriteNullable("urn:example:/thumbnail", value, TermMapping.stringToIri);
    }

    get name(): string | undefined {
        return this.singularNullable("urn:example:/name", ValueMapping.literalToString);
    }

    set name(value: string | undefined) {
        this.overwriteNullable("urn:example:/name", value, TermMapping.stringToLiteral);
    }

    get featured(): boolean | undefined {
        return this.singularNullable("urn:example:/featured", ValueMapping.literalToBoolean);
    }

    set featured(value: boolean | undefined) {
        this.overwriteNullable("urn:example:/featured", value, TermMapping.booleanToLiteral);
    }

    get description(): string | undefined {
        return this.singularNullable("urn:example:/description", ValueMapping.literalToString);
    }

    set description(value: string | undefined) {
        this.overwriteNullable("urn:example:/description", value, TermMapping.stringToLiteral);
    }

    get website(): string | undefined {
        return this.singularNullable("urn:example:/website", ValueMapping.iriToString);
    }

    set website(value: string | undefined) {
        this.overwriteNullable("urn:example:/website", value, TermMapping.stringToIri);
    }
}
