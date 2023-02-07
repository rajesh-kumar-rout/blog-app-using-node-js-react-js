import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

export function authenticate(req, res, next) {
    
    const bearerToken = req.headers.authorization

    const authToken = bearerToken && bearerToken.startsWith("Bearer ") ? bearerToken.substring(7, bearerToken.length) : null 

    try {
        
        const { _id, isAdmin } = jwt.verify(authToken, process.env.AUTH_TOKEN_SECRECT)

        req._id = _id 

        req.isAdmin = isAdmin

    } catch {
        
    }

    next()
}

export function isAuthenticated(req, res, next) {

    if (!req._id) {
        return res.status(401).json({ error: "Authentication failed" })
    }

    next()
}

export function isAdmin(req, res, next) {

    if (!req.isAdmin) {
        return res.status(401).json({ error: "Access denied" })
    }

    next()
}
