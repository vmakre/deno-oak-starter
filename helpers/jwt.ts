import { encodeBase64Url as bEnc, decodeBase64Url as bDec} from "@std/encoding/base64url.ts";

const tEnc=(d:string)=>new TextEncoder().encode(d);
const tDec=(d:Uint8Array)=>new TextDecoder().decode(d);

// generate key
const genKey = async (k:string)=>await crypto.subtle.importKey("raw", tEnc(k), {name:"HMAC", hash:"SHA-256"}, false, ["sign", "verify"]);

// gewnerate JWT 
const getJWT=async (key:CryptoKey, data:any)=>{
    const payload=bEnc(tEnc(JSON.stringify({alg:"HS256", typ:"JWT"})))+'.'+bEnc(tEnc(JSON.stringify(data)));
    const signature=bEnc(new Uint8Array(await crypto.subtle.sign({name:"HMAC"}, key, tEnc(payload))));
    return `${payload}.${signature}`;
  };
const checkJWT=async (key:CryptoKey, jwt:string)=>{
    const jwtParts=jwt.split(".");
    if(jwtParts.length!==3) return;
    const data=tEnc(jwtParts[0]+'.'+jwtParts[1]);
    if(await crypto.subtle.verify({name:"HMAC"}, key, bDec(jwtParts[2]), data)===true)
        return JSON.parse(tDec(bDec(jwtParts[1])));
};

const kluc = Deno.env.get("JWT_TOKEN_SECRET");
const key=await genKey(kluc);


const getAuthToken = async (user: any) : Promise<string> => {
  const data = {
    iss: "deno-api",
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    exp: Date.now() + parseInt(Deno.env.get("JWT_ACCESS_TOKEN_EXP")),
  };
  const jwt= await getJWT(key, data);
  return jwt;
}

const getRefreshToken =  (user: any) => {
  const data  = {
    iss: "deno-api",
    id: user.id,
    exp : Date.now(),
  };
  const jwt= getJWT(key, data);
  return jwt;
};

const getJwtPayload =  (token: string): Promise<any | null> => {
  try {
    const jwtObject =  checkJWT(key, token);
    if (jwtObject ) {
      return jwtObject;
    }
  } catch (err) {}
  return null;
};

// const getJwtPayload = async (token: string): Promise<any | null> => {
//   try {
//     const jwtObject = await validate(token, Deno.env.get("JWT_TOKEN_SECRET"));
//     if (jwtObject && jwtObject.payload) {
//       return jwtObject.payload;
//     }
//   } catch (err) {}
//   return null;
// };

export { getAuthToken, getRefreshToken, getJwtPayload };
