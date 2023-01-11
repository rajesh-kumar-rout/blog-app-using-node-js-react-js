import { config } from "dotenv"

config()

export function authenticate(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    next()
}

export async function verifyCsrf(req, res, next) {
    if (req.method !== "GET" && req.headers['x-xsrf-token'] !== req.session.csrfToken) {
        return res.status(403).json({ message: "Access denied" })
    }

    next()
}