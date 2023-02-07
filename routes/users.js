import { Router } from "express"
import { body, param } from "express-validator"
import Category from "../models/category.js"
import News from "../models/news.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.get("/me/news", async (req, res) => {
    const { _id } = req

    const news = await News.find({ userId: _id }).select({ content: 0 }).sort({ createdAt: -1 })

    res.json(news)
})

routes.get(
    "/me/news/:newsId",

    param("newsId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { newsId } = req.params

        const { _id } = req

        const news = await News.findOne({ userId: newsId, userId: _id })

        res.json(news)
    }
)

routes.post(
    "/me/news",

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

    body("isTrending").isBoolean().toBoolean(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, image, isTrending } = req.body

        const { _id } = req

        if (!await Category.findById(categoryId)) {
            return res.status(404).json({ error: "Category not found" })
        }

        const news = await News.create({
            title,
            content,
            categoryId,
            userId: _id,
            isTrending,
            image: await upload(image)
        })

        res.status(201).json(news)
    }
)

routes.patch(
    "/me/news/:newsId",

    param("newsId").isMongoId(),

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

    body("isTrending").isBoolean().toBoolean(),

    checkValidationError,

    async (req, res) => {
        const { content, title, categoryId, image, isTrending } = req.body

        const { newsId } = req.params

        const { _id } = req

        if (!await Category.findById(categoryId)) {
            return res.status(404).json({ error: "Category not found" })
        }

        const news = await News.findOne({ userId: _id, _id: newsId })

        if (!news) {
            return res.status(404).json({ error: "News not found" })
        }

        news.title = title

        news.content = content

        news.categoryId = categoryId

        news.isTrending = isTrending

        if (image) {
            await destroy(news.image.id)

            news.image = await upload(image)
        }

        await news.save()

        res.json(news)
    }
)

routes.delete(
    "/me/news/:newsId",

    param("newsId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { newsId } = req.params

        const { _id } = req

        const news = await News.findOne({ userId: _id, _id: newsId })

        if (!news) {
            return res.status(404).json({ error: "News not found" })
        }

        await destroy(news.image.id)

        await news.delete()

        res.json(news)
    }
)

export default routes