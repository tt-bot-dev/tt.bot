
import { Locale } from "sosamba";
import FormatJSFormatter from "./FormatJSFormatter.mjs";

class FormatJSLocale extends Locale {
    formatter = new FormatJSFormatter(this);

    constructor(sosamba, fileName, ...args) {
        super(sosamba, fileName, ...args, {
            name: fileName.replace(/\.json$/, ""),
        });
    }
}

export default FormatJSLocale;
