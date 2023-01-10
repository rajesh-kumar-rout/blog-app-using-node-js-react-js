import express from "express"
import cors from "cors"
import blogsRoutes from "./routes/blogs.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import categoriesRoutes from "./routes/categories.js"
import { authenticate } from "./middlewares/authentication.js"
import { config } from "dotenv"

config()
const app = express()

app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogsRoutes)
app.use("/api/users", authenticate, usersRoutes)
app.use("/api/categories", authenticate, categoriesRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
