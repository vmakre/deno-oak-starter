import type { Context } from "./../types.ts";
import * as uuid from "@std/uuid/mod.ts";

/**
 * requestId middleware
 * attach requestId in ctx.state  (or in headers)
 */
const requestIdMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  let requestId = ctx.request.headers.get("X-Response-Id");
  if (!requestId) {
    /** if request id not being set, set unique request id */
    requestId = uuid.v1.generate() ;
    try {
      ctx.state.requestId = requestId.toString() ;
      // request.headers.set("X-Response-Id", requestId.toString());
    }catch (error) {
      throw error;
    }
    // ctx.request.headers.set("X-Response-Id", requestId.toString());
  } 
  await next();
  /** destroy state variables after middleware */
  delete ctx.state.requestId; // cleanup

  /** add request id in response header */
  ctx.response.headers.set("X-Response-Id", requestId);
};

export { requestIdMiddleware };
