import bcrypt from "bcrypt"
import crypto from "crypto"
import { Router } from "express"
import { body } from "express-validator"
import { authenticate } from "../middlewares/authentication.js"
import { destroy, upload } from "../utils/cloudinary.js"
import { fetch, query } from "../utils/database.js"
import { checkValidationError } from "../utils/validation.js"

const routes = Router()

routes.post(
    "/login",

    body("email").isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { email, password } = req.body

        const user = await fetch("SELECT * FROM blog_users WHERE email = ? LIMIT 1", [email])

        if (!(user && await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        req.session.userId = user.id

        res.json({ message: "Login successfull" })
    }
)

routes.post(
    "/register",

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    body("password").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { name, email, password } = req.body

        if (await fetch("SELECT 1 FROM blog_users WHERE email = ? LIMIT 1", [email])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const { insertId } = await query("INSERT INTO blog_users (name, email, password) VALUES (?, ?, ?)", [name, email, await bcrypt.hash(password, 10)])

        req.session.userId = insertId

        res.status(201).json({ message: "Register successfull" })
    }
)

routes.get("/logout", async (req, res) => {
    req.session.destroy()

    res.json({ message: "Logout successfull" })
})

routes.patch(
    "/change-password",

    authenticate,

    body("oldPassword").isLength({ min: 6, max: 20 }),

    body("newPassword").isLength({ min: 6, max: 20 }),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.session
        const { oldPassword, newPassword } = req.body

        const user = await fetch("SELECT password FROM blog_users WHERE id = ? LIMIT 1", [userId])

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query("UPDATE blog_users SET password = ? WHERE id = ?", [await bcrypt.hash(newPassword, 10), userId])

        res.json({ message: "Password changed successfully" })
    }
)

routes.patch(
    "/edit-account",

    authenticate,

    body("name")
        .trim()
        .isLength({ min: 2, max: 30 }),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail(),

    checkValidationError,

    async (req, res) => {
        const { userId } = req.session
        const { name, email, profileImg } = req.body

        if (await fetch("SELECT 1 FROM blog_users WHERE email = ? AND id != ? LIMIT 1", [email, userId])) {
            return res.status(409).json({ message: "Email already taken" })
        }

        const user = await fetch("SELECT * FROM blog_users WHERE id = ? LIMIT 1", [userId])

        if (profileImg) {
            const { imgUrl, imgId } = await upload(profileImg)
            user.profileImgUrl && await destroy(user.profileImgId)
            user.profileImgUrl = imgUrl
            user.profileImgId = imgId
        }

        await query("UPDATE blog_users SET name = ?, email = ?, profileImgUrl = ?, profileImgId = ? WHERE id = ?", [name, email, user.profileImgUrl, user.profileImgId, userId])

        res.json({
            profileImgUrl: user.profileImgUrl
        })
    }
)

routes.get("/", async (req, res) => {
    const { userId } = req.session

    const user = await fetch("SELECT id, name, email, profileImgUrl, createdAt, updatedAt FROM blog_users WHERE id = ? LIMIT 1", [userId ?? null])

    const csrfToken = crypto.randomUUID()

    req.session.csrfToken = csrfToken

    res.cookie("X-XSRF-TOKEN", csrfToken).json(user)
})

export default routes