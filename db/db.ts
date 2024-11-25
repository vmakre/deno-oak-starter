import { Client } from "mysql";

const port = Deno.env.get("DB_PORT") ? parseInt(Deno.env.get("DB_PORT") || "") : undefined;

const db = await new Client().connect({
  port,
  hostname: Deno.env.get("DDB_HOST"),
  username: Deno.env.get("DB_USER"),
  db: Deno.env.get("DB_NAME"),
  password: Deno.env.get("DB_PASS"),
});

export { db };
