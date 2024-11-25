import {  Context as OakContext } from "@oak/context.ts";
import type { AuthUser } from "./../auth/auth-user.ts";

/**
 * Custom appilication context
 */
export class  Context extends OakContext {
  user?: AuthUser;
  requestid?: Int16Array;
}
