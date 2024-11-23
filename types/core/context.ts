import { Context as OakContext } from "jsr:@oak/oak/";
import { AuthUser } from "./../auth/auth-user.ts";

/**
 * Custom appilication context
 */
export class ContextState extends OakContext {
  user?: AuthUser;
}
