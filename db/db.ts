// import  mysql  from "mysql";

import type { DB } from './db.d.ts' // this is the Database interface we defined earlier
import { createPool } from 'mysql' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely'


const port = Deno.env.get("DB_PORT") ? parseInt(Deno.env.get("DB_PORT") || "") : undefined;

// const db = await mysql.createConnection({
//   host: Deno.env.get("DB_HOST"),
//   port: port,
//   user: Deno.env.get("DB_USER"),
//   password: Deno.env.get("DB_PASS"),
// });


const dialect = new MysqlDialect({
  pool: createPool({
    database: Deno.env.get("DB_NAME"),
    host: Deno.env.get("DB_HOST"),
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASS"),
    port: port,
    connectionLimit: 10,
  })
})

export const db = new Kysely<DB>({
  dialect,
})
// export { db };


