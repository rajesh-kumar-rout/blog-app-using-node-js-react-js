import dotenv from "dotenv"
import express from "express"
import { authenticate, isAuthenticated } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import newsRoutes from "./routes/news.js"
import categoriesRoutes from "./routes/categories.js"
import usersRoutes from "./routes/users.js"
import mongoose from "mongoose"

dotenv.config()

const app = express()
mongoose.connect(process.env.MONGO_URL)

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)

app.use("/api/auth", authRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/users", isAuthenticated, usersRoutes)
app.use("/api/categories", categoriesRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
