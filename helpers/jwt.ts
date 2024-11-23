import {
  Header,
  Payload,
  create,
  getNumericDate ,
  // setExpiration,
} from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { validate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { config } from "./../config/config.ts";

const {
  JWT_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXP,
  JWT_REFRESH_TOKEN_EXP,
} = config;

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
    exp: getNumericDate(new Date().getTime() + parseInt(JWT_ACCESS_TOKEN_EXP)),
  };
// const jwt = await create(header, { exp: getNumericDate(60 * 60) }, key);
  return create({ header, payload, key: JWT_TOKEN_SECRET });
};

const getRefreshToken = (user: any) => {
  const payload: Payload = {
    iss: "deno-api",
    id: user.id,
    exp: getNumericDate(new Date().getTime() + parseInt(JWT_REFRESH_TOKEN_EXP)),
  };

  return create({ header, payload, key: JWT_TOKEN_SECRET });
};

const getJwtPayload = async (token: string): Promise<any | null> => {
  try {
    const jwtObject = await validate(token, JWT_TOKEN_SECRET);
    if (jwtObject && jwtObject.payload) {
      return jwtObject.payload;
    }
  } catch (err) {}
  return null;
};

export { getAuthToken, getRefreshToken, getJwtPayload };
