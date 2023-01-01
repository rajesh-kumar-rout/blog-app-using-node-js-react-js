import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { body, param } from "express-validator"
import { checkValidationError } from "../utils/validation.js"
import { upload, destroy } from "../utils/cloudinary.js"

const routes = Router()

routes.get("/blogs", async (req, res) => {
    const { currentUserId } = req.local

    const posts = await query("SELECT posts.id, posts.title, LEFT(posts.content, 100) AS content, posts.imgUrl, categories.name AS category, posts.createdAt, posts.updatedAt FROM posts INNER JOIN categories ON categories.id = posts.categoryId WHERE userId = ? ORDER BY id DESC", [currentUserId])

    res.json(posts)
})

routes.get("/blogs/:blogId", async (req, res) => {
    const { blogId } = req.params

    const posts = await fetch("SELECT * FROM posts WHERE id = ? LIMIT 1", [blogId])

    res.json(posts)
})

routes.post(
    "/blogs",

    body("title").trim().notEmpty().isLength({ max: 255 }),

    body("content").trim().notEmpty().isLength({ max: 5000 }),

    body("categoryId").isInt(),

    body("img").isString(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, img } = req.body
        const { currentUserId } = req.local

        if (!await fetch("SELECT 1 FROM categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        let imgRes = await upload(img)
        const imgUrl = imgRes.secure_url
        const imgId = imgRes.public_id

        await query("INSERT INTO posts (title, content, imgUrl, imgId, userId, categoryId) VALUES (?, ?, ?, ?, ?, ?)", [title, content, imgUrl, imgId, currentUserId, categoryId])

        res.status(201).json({ message: "Post added successfully" })
    }
)


routes.patch(
    "/blogs/:blogId",

    param("blogId").isInt(),

    body("categoryId").isInt(),

    body("title").trim().isLength({ max: 255 }),

    body("content").trim().isLength({ max: 5000 }),

    body("img").optional().isString(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, img } = req.body
        const { blogId } = req.params
        const { currentUserId } = req.local

        if (!await fetch("SELECT 1 FROM categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        const post = await fetch("SELECT * FROM posts WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (img) {
            post.imgId && (await destroy(post.imgId))
            const imgRes = await upload(img)
            post.imgUrl = imgRes.secure_url
            post.imgId = imgRes.public_id
        }

        await query("UPDATE posts SET title = ?, content = ?, imgUrl = ?, imgId = ?, categoryId = ? WHERE id = ?", [title, content, post.imgUrl, post.imgId, categoryId, blogId])

        res.status(201).json({ message: "Post updated successfully" })
    }
)

routes.delete(
    "/blogs/:blogId",

    param("blogId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { blogId } = req.params
        const { currentUserId } = req.local

        const post = await fetch("SELECT * FROM posts WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        post.imgUrl && await destroy(post.imgId)

        await query("DELETE FROM posts WHERE id = ? AND userId = ?", [blogId, currentUserId])

        res.json({ message: "Post deleted successfully" })
    }
)

routes.get("/", async (req, res) => {
    const { currentUserId } = req.local

    const user = await fetch("SELECT id, name, email, profileImgUrl, createdAt, updatedAt FROM users WHERE id = ? LIMIT 1", [currentUserId])

    res.json(user)
})

export default routes