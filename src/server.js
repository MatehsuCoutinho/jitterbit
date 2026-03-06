require("dotenv").config()
const express = require("express")
const cors = require("cors")
const authMiddleware = require("./middlewares/auth.middleware")
const orderRoutes = require("./routes/order.routes")
const authRoutes = require("./routes/auth.routes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/order", orderRoutes)
app.use("/auth", authRoutes)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})