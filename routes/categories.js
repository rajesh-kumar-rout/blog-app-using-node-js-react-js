import { Router } from "express"
import { query } from "../database/connection.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const categories = await query("SELECT id, name FROM b_categories")
    res.json(categories)
})

export default routes