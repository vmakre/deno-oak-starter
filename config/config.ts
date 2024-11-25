import { load as loadConfig } from "@std/dotenv/mod.ts";

export const config = await loadConfig({
    envPath: "./.env",
    export: true,
    allowEmptyValues: false,
});
