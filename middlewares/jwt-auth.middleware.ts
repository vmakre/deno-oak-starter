import type { Context, AuthUser } from "./../types.ts";
import { httpErrors } from "@oak/mod.ts";
import { decodeBase64Url as bDec} from "@std/encoding/base64url.ts";
// import { validate } from "@djwt/mod.ts";

const tEnc=(d:string)=>new TextEncoder().encode(d);
const tDec=(d:Uint8Array)=>new TextDecoder().decode(d);
// generate key
const genKey = async (k:string)=>await crypto.subtle.importKey("raw", tEnc(k), {name:"HMAC", hash:"SHA-256"}, false, ["sign", "verify"]);

const checkJWTexpired = async (key:CryptoKey, jwt:string)=>{
  const jwtParts=jwt.split(".");
  if(jwtParts.length!==3) return;
  const data=tEnc(jwtParts[0]+'.'+jwtParts[1]);
  if(await crypto.subtle.verify({name:"HMAC"}, key, bDec(jwtParts[2]), data)===true){
    const jsonpart1 = JSON.parse(tDec(bDec(jwtParts[1]))) ;
    if (Date.now() > jsonpart1.exp) {
        throw new httpErrors.Unauthorized("Token not valid or expired");
    }     
  }
  return JSON.parse(tDec(bDec(jwtParts[1])));
};


/**
 * Decode token and returns payload
 * if given token is not expired 
 * and valid with respect to given `secret`
 */
const getJwtPayload = async (token: string, secret: string): Promise<any | null> => {
  const key=await genKey(secret);
  try {
    const jwtObject = await checkJWTexpired(key, token);
    if (jwtObject ) {
      return jwtObject;
    }
  } catch (err) {}
  return null;
};


/***
 * JWTAuth middleware
 * Decode authorization bearer token
 * and attach as an user in application context
 */
const JWTAuthMiddleware = (JWTSecret: string) => {
  return async (
    ctx: Context,
    next: () => Promise<void>,
  ) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace(/^bearer/i, "").trim();
        const user = await getJwtPayload(token, JWTSecret);
        if (user) {
          ctx.user = user as AuthUser;
        }
      }
    } catch (err) { }
    await next();
  };

}

export { JWTAuthMiddleware };
