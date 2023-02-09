import { Router } from "express"
import Post from "../models/post.js"
import { checkValidationError } from "../utils/validation.js"
import { isAdmin, isAuthenticated } from "../middlewares/authentication.js"
import { param } from "express-validator"
import User from "../models/user.js"

const routes = Router()

routes.get("/", async (req, res) => {
    const news = await Post.find({ isApproved: true }).sort({ createdAt: -1 }).select({ content: 0 })

    res.json(news)
})

routes.get(
    "/:postId",

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        let post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        post = post.toObject()

        post.author = await User.findOne({_id: post.authorId}).select({password: 0})

        res.json(post)
    }
)

routes.get("/:unapproved", async (req, res) => {
    const posts = await Post.find({ isApproved: false })

    res.json(posts)
})

routes.patch(
    "/:postId/approve",

    isAuthenticated,

    isAdmin,

    param("postId").isMongoId(),

    checkValidationError,

    async (req, res) => {
        const { postId } = req.params

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        post.isApproved = true

        await post.save()

        res.json(post)
    }
)

export default routes