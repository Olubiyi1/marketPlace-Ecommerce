import { seedProduct } from "./seedProduct.js";

const seed=async()=>{
    await seedProduct()
    console.log("product seeded successfully");
    
}
seed()