import { seedUser } from "./seedUser.js";

const seed =async()=>{
    await seedUser()
    console.log("user seeded successfully");
    
}
seed()