const authService = require("../services/auth.service")

// Registra um novo usuário
async function register(req, res) {
    try {
        const { email, password } = req.body
        const user = await authService.register(email, password)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Autentica o usuário e retorna o token JWT
async function login(req, res) {
    try {
        const { email, password } = req.body
        const result = await authService.login(email, password)
        res.json(result)
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

module.exports = {
    register,
    login
}