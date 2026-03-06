require("dotenv").config()
const express = require("express")
const cors = require("cors")

//const orderRoutes = require("./routes/orderRoutes")

const app = express()

app.use(cors())
app.use(express.json())

//app.use("/order", orderRoutes)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})