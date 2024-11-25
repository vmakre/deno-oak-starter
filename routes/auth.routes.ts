import type {
  Context,
  CreateUser,
  RefreshToken,
  LoginCredential,
} from "./../types.ts";
import {
  required,
  isEmail,
  lengthBetween,
} from "validasaur";

import * as authService from "./../services/auth.service.ts";
import { requestValidator } from "./../middlewares/request-validator.middleware.ts";

/** 
 * request body schema 
 * for user create/update 
 * */
const registrationSchema = {
  name: [required],
  email: [required, isEmail],
  password: [required, lengthBetween(6, 12)],
};

//todo: add validation alphanumeric, spechal char

/**
 * register user
 */
const register = [
  /** request validation middleware */
  requestValidator({ bodyRules: registrationSchema }),
  /** router handler */
  async (ctx: Context) => {
    const request = ctx.request;
    const userData =  await request.body.json() as CreateUser;
    const user = await authService.registerUser(userData);
    ctx.response.body = user;
  },
];

/** 
 * login body schema 
 * for user create/update 
 * */
const loginSchema = {
  email: [required, isEmail],
  password: [required, lengthBetween(6, 12)],
};

//  (ctx: Context, next: () => Promise<void>) 
const login = [
  /** request validation middleware */
  requestValidator({ bodyRules: loginSchema }),
  /** router handler */
  async (ctx: Context) => {
    const request = ctx.request;
    const credential = await request.body.json() as LoginCredential;
    const token = await authService.loginUser(credential);
    ctx.response.body = token;
  },
];

const refreshTokenSchema = {
  refresh_token: [required],
};
const refreshToken = [
  /** request validation middleware */
  requestValidator({ bodyRules: refreshTokenSchema }),
  /** router handler */
  async (ctx: Context) => {
    const request = ctx.request;
    const data = (await request.body.json()).value as RefreshToken;

    const token = await authService.refreshToken(
      data["refresh_token"],
    );
    ctx.response.body = token;
  },
];

export { login, register, refreshToken };
