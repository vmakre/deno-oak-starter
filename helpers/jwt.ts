import {
  type Header ,
  type Payload ,
  create ,
  getNumericDate ,
  validate 
  // setExpiration,
} from "@djwt/mod.ts";
// import { validate } from "@djwt/mod.ts";
// import { config } from "./../config/config.ts";

// const {
//   JWT_TOKEN_SECRET,
//   JWT_ACCESS_TOKEN_EXP,
//   JWT_REFRESH_TOKEN_EXP,
// } = config;

const header: Header = {
  alg: "HS256",
  typ: "JWT",
};

const getAuthToken = (user: any) => {
  const payload: Payload = {
    iss: "deno-api",
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    exp: getNumericDate(new Date().getTime() + parseInt(Deno.env.get("JWT_ACCESS_TOKEN_EXP"))),
  };
  // const jwt = await create(header, { exp: getNumericDate(60 * 60) }, key);
  return create({ header, payload, key: Deno.env.get("JWT_TOKEN_SECRET") });
};

const getRefreshToken = (user: any) => {
  const payload: Payload = {
    iss: "deno-api",
    id: user.id,
    exp: getNumericDate(new Date().getTime() + parseInt(Deno.env.get("JWT_REFRESH_TOKEN_EXP"))),
  };

  return create({ header, payload, key: Deno.env.get("JWT_TOKEN_SECRET") });
};

const getJwtPayload = async (token: string): Promise<any | null> => {
  try {
    const jwtObject = await validate(token, Deno.env.get("JWT_TOKEN_SECRET"));
    if (jwtObject && jwtObject.payload) {
      return jwtObject.payload;
    }
  } catch (err) {}
  return null;
};

export { getAuthToken, getRefreshToken, getJwtPayload };
