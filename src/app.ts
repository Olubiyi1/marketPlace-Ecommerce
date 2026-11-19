import express from "express"
import productRouter from "./Modules/Products/product.route.js"
import orderRouter from "./Modules/Order/order.route.js";
import userRoute from "./Modules/User/user.route.js";

const app = express()
app.use(express.json());
app.get("test",(req,res)=>{
    res.send("server is working")
})

app.use("/api/users",userRoute)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)

export default app;
