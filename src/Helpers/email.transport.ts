import config from "../config/config.js";
import nodemailer from "nodemailer";

export const emailTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:config.email_user,
        pass:config.email_password
    }
})