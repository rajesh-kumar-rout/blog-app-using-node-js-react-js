import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { param } from "express-validator"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const blogs = await query("SELECT id, title, LEFT(content, 200) AS content, imgUrl, createdAt, updatedAt FROM posts ORDER BY id DESC")
    res.json(blogs)
})

routes.get(
    "/:blogId",

    param("blogId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { blogId } = req.params

        const blog = await fetch('SELECT posts.id, posts.title, posts.categoryId, posts.content, posts.imgUrl, posts.createdAt, users.name AS authorName, users.profileImgUrl AS authorImgUrl FROM posts INNER JOIN users ON users.id = posts.userId WHERE posts.id = ? LIMIT 1', [blogId])
        
        if(!blog){
            return res.status(404).json({ message: "Post not found" })
        }

        const relatedBlogs = await query("SELECT id, imgUrl, title FROM posts WHERE categoryId = ? AND posts.id != ? ORDER BY id DESC LIMIT 10", [blog.categoryId, blog.id])

        res.json({
            blog,
            relatedBlogs
        })
    }
)

export default routes