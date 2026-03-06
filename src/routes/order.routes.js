const express = require("express")
const controller = require("../controllers/order.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/", authMiddleware, controller.create)

router.get("/list", authMiddleware, controller.list)

router.get("/:id", authMiddleware, controller.get)

router.put("/:id", authMiddleware, controller.update)

router.delete("/:id", authMiddleware, controller.remove)

module.exports = router