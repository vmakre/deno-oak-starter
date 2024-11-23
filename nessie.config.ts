import { ClientPostgreSQL } from "https://deno.land/x/nessie@2.0.11/mod.ts";
import { ClientMySQL } from "https://deno.land/x/nessie@2.0.11/mod.ts";
import { ClientSQLite } from "https://deno.land/x/nessie@2.0.11/mod.ts";

/** These are the default config options. */
const clientOptions = {
  migrationFolder: "./db/migrations",
  seedFolder: "./db/seeds",
};

const clientMySql = new ClientMySQL(clientOptions, {
  hostname: "localhost",
  port: 3306,
  username: "root",
  password: "example", // uncomment this line for <8
  db: "deno_api_db",
});

/** This is the final config object */
const config = {
  client: clientMySql,
  exposeQueryBuilder: true,
};

export default config;
