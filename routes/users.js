import { Router } from "express"
import { body, param } from "express-validator"
import Category from "../models/category.js"
import Post from "../models/post.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/me/posts", async (req, res) => {
    const { _id } = req

    const posts = await Post.find({ authorId: _id }).select({ content: 0 }).sort({ createdAt: -1 })

    res.json(posts)
})

routes.get(
    "/me/posts/:postId",

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { _id } = req

        const post = await Post.findOne({ userId: _id, _id: postId })

        res.json(post)
    }
)

routes.post(
    "/me/posts",

    body("title")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 255 }),

    body("content")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 5000 }),

    body("categoryId").isMongoId(),

    body("image")
        .isString()
        .notEmpty(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, image, isTrending } = req.body

        const { _id, isAdmin } = req

        if (!await Category.findById(categoryId)) {
            return res.status(404).json({ error: "Category not found" })
        }

        const post = await Post.create({
            title,
            content,
            categoryId,
            authorId: _id,
            isApproved: isAdmin,
            image: await upload(image)
        })

        res.status(201).json(post)
    }
)

routes.patch(
    "/me/posts/:postId",

    param("postId").isMongoId(),

    body("title")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 255 }),

    body("content")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 5000 }),

    body("categoryId").isMongoId(),

    body("image").isString(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, image, isTrending } = req.body

        const { postId } = req.params

        const { _id } = req

        if (!await Category.findById(categoryId)) {
            return res.status(404).json({ error: "Category not found" })
        }

        const post = await Post.findOne({ userId: _id, _id: postId })

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        post.title = title

        post.content = content

        post.categoryId = categoryId

        if (image) {
            await destroy(post.image.id)

            post.image = await upload(image)
        }

        await post.save()

        res.json(post)
    }
)

routes.delete(
    "/me/posts/:postId",

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const { _id } = req

        const post = await Post.findOne({ userId: _id, _id: postId })

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        await destroy(post.image.id)

        await post.delete()

        res.json(post)
    }
)

export default routes