import { randomBytes,createHash } from "node:crypto";

// sent along with the email
export const generateToken = ()=>{
    const token = randomBytes(32).toString("hex")
    return token
}

// saved to redis
export const hashToken = (token:string)=>{
    return createHash("sha256").update(token).digest("hex")
}
