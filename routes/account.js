import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { body, param } from "express-validator"
import { checkValidationError } from "../utils/validation.js"
import { upload, destroy } from "../utils/cloudinary.js"

const routes = Router()

routes.get("/blogs", async (req, res) => {
    const { currentUserId } = req.local

    const blogs = await query("SELECT b_blogs.id, b_blogs.title, LEFT(b_blogs.content, 100) AS content, b_blogs.imgUrl, b_categories.name AS category, b_blogs.createdAt, b_blogs.updatedAt FROM b_blogs INNER JOIN b_categories ON b_categories.id = b_blogs.categoryId WHERE b_blogs.userId = ? ORDER BY id DESC", [currentUserId])

    res.json(blogs)
})

routes.get("/blogs/:blogId", async (req, res) => {
    const { blogId } = req.params

    const blog = await fetch("SELECT * FROM b_blogs WHERE id = ? LIMIT 1", [blogId])

    res.json(blog)
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

        if (!await fetch("SELECT 1 FROM b_categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        let imgRes = await upload(img)
        const imgUrl = imgRes.secure_url
        const imgId = imgRes.public_id

        await query("INSERT INTO b_blogs (title, content, imgUrl, imgId, userId, categoryId) VALUES (?, ?, ?, ?, ?, ?)", [title, content, imgUrl, imgId, currentUserId, categoryId])

        res.status(201).json({ message: "Blog added successfully" })
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

        if (!await fetch("SELECT 1 FROM b_categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        const blog = await fetch("SELECT * FROM b_blogs WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        if (img) {
            blog.imgId && (await destroy(blog.imgId))
            const imgRes = await upload(img)
            blog.imgUrl = imgRes.secure_url
            blog.imgId = imgRes.public_id
        }

        await query("UPDATE b_blogs SET title = ?, content = ?, imgUrl = ?, imgId = ?, categoryId = ? WHERE id = ?", [title, content, blog.imgUrl, blog.imgId, categoryId, blogId])

        res.status(201).json({ message: "Blog updated successfully" })
    }
)

routes.delete(
    "/blogs/:blogId",

    param("blogId").isInt(),

    checkValidationError,

    async (req, res) => {
        const { blogId } = req.params
        const { currentUserId } = req.local

        const blog = await fetch("SELECT * FROM b_blogs WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        blog.imgUrl && await destroy(blog.imgId)

        await query("DELETE FROM b_blogs WHERE id = ? AND userId = ?", [blogId, currentUserId])

        res.json({ message: "Blog deleted successfully" })
    }
)

routes.get("/", async (req, res) => {
    const { currentUserId } = req.local

    const user = await fetch("SELECT id, name, email, profileImgUrl, createdAt, updatedAt FROM b_users WHERE id = ? LIMIT 1", [currentUserId])

    res.json(user)
})

export default routes