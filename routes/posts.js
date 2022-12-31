import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { param } from "express-validator"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const posts = await query("SELECT id, title, LEFT(content, 200) AS content, imgUrl, createdAt, updatedAt FROM posts ORDER BY id DESC")
    res.json(posts)
})

routes.get(
    "/:postId",

    param("postId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const post = await fetch('SELECT posts.id, posts.title, posts.categoryId, posts.content, posts.imgUrl, posts.createdAt, users.name AS authorName, users.profileImgUrl AS authorImgUrl FROM posts INNER JOIN users ON users.id = posts.userId WHERE posts.id = ? LIMIT 1', [postId])
        
        if(!post){
            return res.status(404).json({ message: "Post not found" })
        }

        const relatedPosts = await query("SELECT id, imgUrl, title FROM posts WHERE categoryId = ? AND posts.id != ? ORDER BY id DESC LIMIT 10", [post.categoryId, post.id])

        res.json({
            post,
            relatedPosts
        })
    }
)

export default routes