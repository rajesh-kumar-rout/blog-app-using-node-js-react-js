import { Router } from "express"
import News from "../models/news.js"
import { checkValidationError } from "../utils/validation.js"
import { isAdmin, isAuthenticated } from "../middlewares/authentication.js"
import { param } from "express-validator"

const routes = Router()

routes.get("/trending", async (req, res) => {
    const news = await News.find({ isTrending: true, isApproved: true }).sort({ createdAt: -1 }).select({ content: 0 })

    res.json(news)
})

routes.get(
    "/:newsId",

    param("newsId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { newsId } = req.params

        const news = await News.findById(newsId)

        res.json(news)
    }
)

routes.get("/:unapproved", async (req, res) => {
    const news = await News.find({ isApproved: false })

    res.json(news)
})

routes.patch(
    "/:newsId/approve",

    isAuthenticated,

    isAdmin,

    param("newsId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { newsId } = req.params

        const news = await News.findById(newsId)

        if (!news) {
            return res.status(404).json({ error: "News not found" })
        }

        news.isApproved = true

        await news.save()

        res.json(news)
    }
)

export default routes