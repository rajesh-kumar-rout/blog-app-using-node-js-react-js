import { Router } from "express"
import { query, fetch } from "../database/connection.js"
import { body, param } from "express-validator"
import { checkValidationError, isBase64Img } from "../utils/validation.js"
import { upload, destroy } from "../utils/cloudinary.js"

const routes = Router()

routes.get("/me/blogs", async (req, res) => {
    const { currentUserId } = req

    const blogs = await query("SELECT blog_blogs.id, blog_blogs.title, LEFT(blog_blogs.content, 100) AS content, blog_blogs.imgUrl, blog_categories.name AS category, blog_blogs.createdAt, blog_blogs.updatedAt FROM blog_blogs INNER JOIN blog_categories ON blog_categories.id = blog_blogs.categoryId WHERE blog_blogs.userId = ? ORDER BY id DESC", [currentUserId])

    res.json(blogs)
})

routes.get("/me/blogs/:blogId", async (req, res) => {
    const { blogId } = req.params

    const blog = await fetch("SELECT id, title, content, imgUrl, createdAt, updatedAt, categoryId FROM blog_blogs WHERE id = ? LIMIT 1", [blogId])

    res.json(blog)
})

routes.post(
    "/me/blogs",

    body("title").trim().notEmpty().isLength({ max: 255 }),

    body("content").trim().notEmpty().isLength({ max: 5000 }),

    body("categoryId").isInt(),

    body("img").isString().custom(isBase64Img),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, img } = req.body
        const { currentUserId } = req

        if (!await fetch("SELECT 1 FROM blog_categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        const { imgUrl, imgId } = await upload(img)

        await query("INSERT INTO blog_blogs (title, content, imgUrl, imgId, userId, categoryId) VALUES (?, ?, ?, ?, ?, ?)", [title, content, imgUrl, imgId, currentUserId, categoryId])

        res.status(201).json({ message: "Blog added successfully" })
    }
)

routes.patch(
    "/me/blogs/:blogId",

    param("blogId").isInt(),

    body("categoryId").isInt(),

    body("title").trim().isLength({ max: 255 }),

    body("content").trim().isLength({ max: 5000 }),

    body("img")
        .optional()
        .isString()
        .custom(isBase64Img),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, img } = req.body
        const { blogId } = req.params
        const { currentUserId } = req

        if (!await fetch("SELECT 1 FROM blog_categories WHERE id = ? LIMIT 1", [categoryId])) {
            return res.status(404).json({ message: "Category not found" })
        }

        const blog = await fetch("SELECT * FROM blog_blogs WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        if (img) {
            blog.imgId && (await destroy(blog.imgId))
            const { imgUrl, imgId } = await upload(img)
            blog.imgUrl = imgUrl
            blog.imgId = imgId
        }

        await query("UPDATE blog_blogs SET title = ?, content = ?, imgUrl = ?, imgId = ?, categoryId = ? WHERE id = ?", [title, content, blog.imgUrl, blog.imgId, categoryId, blogId])

        res.status(201).json({ message: "Blog updated successfully" })
    }
)

routes.delete("/me/blogs/:blogId", async (req, res) => {
    const { blogId } = req.params
    const { currentUserId } = req

    const blog = await fetch("SELECT * FROM blog_blogs WHERE id = ? AND userId = ? LIMIT 1", [blogId, currentUserId])

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" })
    }

    blog.imgUrl && await destroy(blog.imgId)

    await query("DELETE FROM blog_blogs WHERE id = ? AND userId = ?", [blogId, currentUserId])

    res.json({ message: "Blog deleted successfully" })
})

routes.get("/", async (req, res) => {
    const { currentUserId } = req.local

    const user = await fetch("SELECT id, name, email, profileImgUrl, createdAt, updatedAt FROM b_users WHERE id = ? LIMIT 1", [currentUserId])

    res.json(user)
})

export default routes