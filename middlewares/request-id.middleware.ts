import { ContextState } from "./../types.ts";
import * as uuid from "jsr:@std/uuid";

/**
 * requestId middleware
 * attach requestId in request & response header 
 */
const requestIdMiddleware = async (ctx: ContextState, next: () => Promise<void>) => {
  let requestId = ctx.request.headers.get("X-Response-Id");
  if (!requestId) {
    /** if request id not being set, set unique request id */
    requestId = uuid.v1.generate();
    // ctx.request.headers.set("X-Response-Id", requestId.toString());
  }
  await next();
  /** add request id in response header */
  ctx.response.headers.set("X-Response-Id", requestId);
};

export { requestIdMiddleware };
