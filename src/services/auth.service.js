const prisma = require("../config/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { z } = require("zod")

// Schema de validação do registro — garante email válido e senha forte
const registerSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
        .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
        .regex(/[0-9]/, "Deve conter ao menos um número")
})

// Registra um novo usuário com a senha criptografada
async function register(email, password) {
    registerSchema.parse({ email, password })

    // Verifica se o e-mail já está em uso
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error("E-mail já cadastrado")

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
        select: { id: true, email: true } // nunca retorna a senha
    })

    return user
}

// Valida as credenciais e retorna um token JWT
async function login(email, password) {

    const user = await prisma.user.findUnique({ where: { email } })

    // Mensagem genérica para não revelar se o e-mail existe ou não
    if (!user) throw new Error("Credenciais inválidas")

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error("Credenciais inválidas")

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    return { token }
}

module.exports = {
    register,
    login
}