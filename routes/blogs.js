import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { param } from "express-validator"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const blogs = await query("SELECT id, title, LEFT(content, 200) AS content, imgUrl, createdAt, updatedAt FROM b_blogs ORDER BY id DESC")
    res.json(blogs)
})

routes.get(
    "/:blogId",

    param("blogId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { blogId } = req.params

        const blog = await fetch('SELECT b_blogs.id, b_blogs.title, b_blogs.categoryId, b_blogs.content, b_blogs.imgUrl, b_blogs.createdAt, b_users.name AS authorName, b_users.profileImgUrl AS authorImgUrl FROM b_blogs INNER JOIN b_users ON b_users.id = b_blogs.userId WHERE b_blogs.id = ? LIMIT 1', [blogId])
        
        if(!blog){
            return res.status(404).json({ message: "Post not found" })
        }

        const relatedBlogs = await query("SELECT id, imgUrl, title FROM b_blogs WHERE categoryId = ? AND id != ? ORDER BY id DESC LIMIT 10", [blog.categoryId, blog.id])

        res.json({
            blog,
            relatedBlogs
        })
    }
)

export default routes