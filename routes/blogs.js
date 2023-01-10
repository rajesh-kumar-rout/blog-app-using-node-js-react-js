import { Router } from "express"
import { query, fetch } from "../database/connection.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const blogs = await query("SELECT id, title, LEFT(content, 200) AS content, imgUrl, createdAt, updatedAt FROM blog_blogs ORDER BY id DESC")
    res.json(blogs)
})

routes.get("/:blogId", async (req, res) => {
    const { blogId } = req.params

    const blog = await fetch('SELECT blog_blogs.id, blog_blogs.title, blog_blogs.categoryId, blog_blogs.content, blog_blogs.imgUrl, blog_blogs.createdAt, blog_users.name AS authorName, blog_users.profileImgUrl AS authorImgUrl FROM blog_blogs INNER JOIN blog_users ON blog_users.id = blog_blogs.userId WHERE blog_blogs.id = ? LIMIT 1', [blogId])

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" })
    }

    const relatedBlogs = await query("SELECT id, imgUrl, title FROM blog_blogs WHERE categoryId = ? AND id != ? ORDER BY id DESC LIMIT 10", [blog.categoryId, blog.id])

    res.json({
        blog,
        relatedBlogs
    })
})

export default routes