import { Router } from "express"
import { param } from "express-validator"
import Category from "../models/category.js"
import Post from "../models/post.js"
import { checkValidationError } from "../utils/validation.js"
import { isAdmin, isAuthenticated } from "../middlewares/authentication.js"
import { body } from "express-validator"

const routes = Router()

routes.get("/", async (req, res) => {
    const categories = await Category.find()
    res.json(categories)
})

routes.get(
    "/:categoryId/posts",

    param("categoryId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { categoryId } = req.params

        const { limit } = req.query

        const post = await Post.find({ categoryId }).limit(limit).sort({ createdAt: -1 })

        res.json(post)
    }
)

routes.post(
    "/",

    isAuthenticated,

    isAdmin,

    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    checkValidationError,

    async (req, res) => {
        const { name } = req.body

        const { _id } = req

        if (await Category.findOne({ name })) {
            return res.status(409).json({ error: "Category already exists" })
        }

        const category = await Category.create({ name })

        res.json(category)
    }
)

routes.patch(
    "/:categoryId",

    isAuthenticated,

    isAdmin,

    param("categoryId").isMongoId(),

    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    checkValidationError,

    async (req, res) => {
        const { name } = req.body

        const { categoryId } = req.params

        if (await Category.findOne({ name, _id: { $ne: categoryId } })) {
            return res.status(409).json({ error: "Category already exists" })
        }

        const category = await Category.findById(categoryId)

        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        category.name = name

        await category.save()

        res.json(category)
    }
)

routes.delete(
    "/:categoryId",

    isAuthenticated,

    isAdmin,

    param("categoryId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { categoryId } = req.params

        const category = await Category.findById(categoryId)

        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }

        const posts = await Post.find({ categoryId })

        for (const postItem in posts) {
            await destroy(postItem.image.id)
        }

        await Post.deleteMany({ categoryId })

        await category.delete()

        res.json(category)
    }
)

export default routes