import { ClientPostgreSQL } from "nessie";
import { ClientMySQL } from "nessie";
import { ClientSQLite } from "nessie";

/** These are the default config options. */
const clientOptions = {
  migrationFolder: "./db/migrations",
  seedFolder: "./db/seeds",
};

const clientMySql = new ClientMySQL(clientOptions, {
  hostname: "192.168.100.8",
  port: 3306,
  username: "root",
  password: "root", // uncomment this line for <8
  db: "deno_api_db",
});

/** This is the final config object */
const config = {
  client: clientMySql,
  exposeQueryBuilder: true,
};

export default config;
