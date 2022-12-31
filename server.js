import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import postsRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import categoriesRoutes from "./routes/categories.js"
import path from "path"
import { cwd } from "process"
import { setUpRequest } from "./middlewares/setUp.js"
import { authenticate } from "./middlewares/authentication.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(setUpRequest)
app.use(express.static("view"))

app.use("/api/auth", authRoutes)
app.use("/api/posts", authenticate, postsRoutes)
app.use("/api/users", authenticate, usersRoutes)
app.use("/api/categories", authenticate, categoriesRoutes)

app.get("*", (req, res) => {
    res.sendFile(path.resolve(cwd() + "/view/index.html"))
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
