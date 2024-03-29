import dotenv from "dotenv"
import express from "express"
import { authenticate, isAuthenticated } from "./middlewares/authentication.js"
import authRoutes from "./routes/auth.js"
import postsRoutes from "./routes/posts.js"
import categoriesRoutes from "./routes/categories.js"
import usersRoutes from "./routes/users.js"
import mongoose from "mongoose"
import cors from "cors"
import path from "path"

dotenv.config()

const app = express()
mongoose.connect(process.env.MONGO_URL)

app.use(express.static("public"))
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(authenticate)

app.use("/api/auth", authRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/users", isAuthenticated, usersRoutes)
app.use("/api/categories", categoriesRoutes)

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("public/index.html"))
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
