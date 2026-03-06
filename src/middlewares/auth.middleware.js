const jwt = require("jsonwebtoken")

// Middleware que protege rotas — valida o token JWT enviado no header
function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não fornecido" })
    }

    const token = authHeader.split(" ")[1]

    try {
        // Decodifica o token e anexa o payload na requisição
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        const message = error.name === "TokenExpiredError"
            ? "Token expirado"
            : "Token inválido"

        return res.status(401).json({ message })
    }
}

module.exports = authMiddleware