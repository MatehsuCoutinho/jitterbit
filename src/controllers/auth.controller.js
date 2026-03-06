const authService = require("../services/auth.service")
const { ZodError } = require("zod")

function handleError(res, error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: error.issues.map(e => ({  
                field: e.path.join("."),
                message: e.message
            }))
        })
    }

    const status = error.statusCode || 400
    res.status(status).json({ message: error.message })
}

async function register(req, res) {
    try {
        const { email, password } = req.body
        const user = await authService.register(email, password)
        res.status(201).json(user)
    } catch (error) {
        handleError(res, error)
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        const result = await authService.login(email, password)
        res.json(result)
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { register, login }