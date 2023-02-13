import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { Router } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import { isAuthenticated } from "../middlewares/authentication.js"
import User from "../models/user.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { checkValidationError } from "../utils/validation.js"

dotenv.config()

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ error: "Invalid email or password" })
        }

        const authToken = jwt.sign(
            {
                _id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.AUTH_TOKEN_SECRECT,
            {
                expiresIn: "72h"
            }
        )

        res.json({authToken})
    }
)

routes.post(
    "/register",

    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { name, email, password, profileImage } = req.body

        if (await User.findOne({ email })) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10)
        })

        if(profileImage){
            user.profileImage = await upload(profileImage)
        }

        await user.save()

        user.password = undefined

        const authToken = jwt.sign(
            {
                _id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.AUTH_TOKEN_SECRECT,
            {
                expiresIn: "72h"
            }
        )

        res.json({ user, authToken })
    }
)

routes.patch(
    "/change-password",

    isAuthenticated,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { _id } = req

        const { oldPassword, newPassword } = req.body

        const user = await User.findById(_id)

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ error: "Old password does not match" })
        }

        user.password = await bcrypt.hash(newPassword, 10)

        await user.save()

        res.json({ success: "Password changed successfully" })
    }
)

routes.patch(
    "/edit-profile",

    isAuthenticated,

    body("name")
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    checkValidationError,

    async (req, res) => {
        const { _id } = req

        const { name, email, profileImage } = req.body

        if (await User.findOne({ email, _id: { $ne: _id } })) {
            return res.status(409).json({ error: "Email already taken" })
        }

        const user = await User.findById(_id)

        user.name = name

        user.email = email

        if(profileImage) {

            user.profileImage && await destroy(user.profileImage.id)

            user.profileImage = await upload(profileImage)
        }

        await user.save()

        user.password = undefined

        res.json(user)
    }
)

routes.get("/", async (req, res) => {
    const { _id } = req

    const user = await User.findById(_id)

    if(user){
        user.password = undefined
    }

    res.json(user)
})

export default routes