import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

/**
 * @type {import("../package.json")}
 */
export default JSON.parse(await readFile(join(fileURLToPath(import.meta.url), "../../package.json"), { encoding: "utf-8" }));

/**
 * @type {import("sosamba/package.json")}
 */
export const sosambaPackage = JSON.parse(await readFile(join(fileURLToPath(import.meta.url), "../../node_modules/sosamba/package.json"), { encoding: "utf-8" }));