import express from "express"
import cors from "cors"
import categoriesRoute from "./routes/categoriesRoute.js"
import gamesRoute from "./routes/gamesRoute.js"
import customersRoute from "./routes/customersRoute.js" 
import rentalsRoute from "./routes/rentalsRoute.js"

const app = express()

app
.use(cors())
.use(express.json())
    
.use(categoriesRoute, gamesRoute, customersRoute, rentalsRoute)


.listen(4000, () => console.log("server running in port 4000"))