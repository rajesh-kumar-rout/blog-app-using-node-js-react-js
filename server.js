import express from "express"
import cors from "cors"
import blogsRoutes from "./routes/blogs.js"
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import categoriesRoutes from "./routes/categories.js"
import { authenticate, verifyCsrf } from "./middlewares/authentication.js"
import { config } from "dotenv"
import session from "./utils/session.js"

config()
const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(session)
app.use(verifyCsrf)
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogsRoutes)
app.use("/api/users", authenticate, usersRoutes)
app.use("/api/categories", authenticate, categoriesRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})
