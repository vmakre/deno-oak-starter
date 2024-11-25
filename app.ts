import { Application } from "@oak/mod.ts";
import * as middlewares from "./middlewares/middlewares.ts";
import { router } from "./routes/routes.ts";
import type { Context } from "./types.ts";
import { oakCors } from "cors";
// import { config } from "./config/config.ts";
import { printStartupMessage } from "./helpers/somefunc.ts";

const port = 8000;
const app = new Application<Context>();
 
app.use(oakCors());
app.use(middlewares.loggerMiddleware);
app.use(middlewares.errorMiddleware);
app.use(middlewares.timingMiddleware);

app.use(middlewares.JWTAuthMiddleware( Deno.env.get("JWT_TOKEN_SECRET") ));
app.use(middlewares.requestIdMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());


app.addEventListener("listen", printStartupMessage);
await app.listen({ port });
