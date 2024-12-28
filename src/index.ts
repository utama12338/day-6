import express from "express"
 const app =express()

app.use(express.json())

import userRoutes from "./routes/userRoutes.js"

app.use("/users", userRoutes)

const port = process.env.port|| 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)

})