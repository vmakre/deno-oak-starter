import {
  validate,
  type ValidationErrors,
  type ValidationRules,
} from "validasaur";
import { httpErrors } from "@oak/mod.ts";
import type { Context } from "./../types.ts";

/**
 * get single error message from errors
 */
const getErrorMessage = (
  errors: ValidationErrors,
): string | undefined => {
  for (const attr in errors) {
    const attrErrors = errors[attr];
    for (const rule in attrErrors) {
      return attrErrors[rule] as string;
    }
  }
};

/**
 * request validation middleware 
 * validate request body with given validation rules
 */
const requestValidator = ({ bodyRules }: { bodyRules: ValidationRules }) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    /** get request body */
    const request = ctx.request;
    const json = (await request.body.json());
    

    /** check rules */
    const [isValid, errors] = await validate(json, bodyRules);
    if (!isValid) {
      /** if error found, throw bad request error */
      const message = getErrorMessage(errors);
      throw new httpErrors.BadRequest(message);
    }

    await next();
  };
};

export { requestValidator };
