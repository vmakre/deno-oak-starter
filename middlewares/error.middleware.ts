import {
  isHttpError,
  Status,
} from "@oak/mod.ts";
import type { Context } from "./../types.ts";

const errorMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next();
  } catch (err) {

    
    let message = err.message;
    const status = err.status || err.statusCode || Status.InternalServerError;

    /**
     * considering all unhandled errors as internal server error,
     * do not want to share internal server errors to 
     * end user in non "development" mode
     */
    if (!isHttpError(err)) {
      message = Deno.env.get("ENV") === "dev" || Deno.env.get("ENV") === "development"
        ? message
        : "Internal Server Error";
    }

    if (Deno.env.get("ENV") === "dev" || Deno.env.get("ENV") === "development") {
        console.log(err);
    }

    ctx.response.status = status;
    ctx.response.body = { status, message };
  }
};

export { errorMiddleware };
