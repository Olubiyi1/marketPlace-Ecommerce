import * as argon2 from "argon2"

class Guards{
    static async hashPassword(password:string){
        return await argon2.hash(password)
    }

    static async verifyPassword(hashPasswrod:string,password:string){
        return await argon2.verify(hashPasswrod,password)
    } 
}
export default new Guards