import { Router } from "express"
import { query } from "../utils/database.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const categories = await query("SELECT id, name FROM blog_categories")
    res.json(categories)
})

export default routes