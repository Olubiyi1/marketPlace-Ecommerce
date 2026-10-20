import { Worker } from "bullmq";
import redisConnection from "../../config/redis.config.js";

const emailVerificationWorker =  new Worker("email-queue",
    async(job)=>{
        if(job.name === "send-verification-email"){
            const {email,token}= job.data

            // send verification email here
            console.log("preparing to send email");
        }        
    },
    {
        connection:redisConnection
    }
);
emailVerificationWorker.on("completed",(job)=>{
    console.log(`Email job ${job.id} completed`);
})
emailVerificationWorker.on("failed",(job,err)=>{
    console.error(`Email job ${job?.id} failed`,err.message);
    
})
export default emailVerificationWorker;