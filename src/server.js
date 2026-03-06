require("dotenv").config()
const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")

const authMiddleware = require("./middlewares/auth.middleware")
const orderRoutes = require("./routes/order.routes")
const authRoutes = require("./routes/auth.routes")

const app = express()

// Carrega e serve a documentação Swagger
const swaggerDocument = YAML.load("./docs/swagger.yaml") 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())
app.use(express.json())

app.use("/order", orderRoutes)
app.use("/auth", authRoutes)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Docs available at http://localhost:${PORT}/docs`)
})