const orderService = require("../services/order.service")
const { mapOrder } = require("../utils/orderMapper")

// Trata erros de forma padronizada — Zod retorna detalhes dos campos inválidos
function handleError(res, error) {
    if (error.name === "ZodError") {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: error.errors.map(e => ({
                field: e.path.join("."),
                message: e.message
            }))
        })
    }

    const status = error.statusCode || 500
    res.status(status).json({ message: error.message })
}

// Cria um novo pedido a partir do body recebido
async function create(req, res) {
    try {
        const mappedOrder = mapOrder(req.body)
        const order = await orderService.createOrder(mappedOrder)
        res.status(201).json(order)
    } catch (error) {
        handleError(res, error)
    }
}

// Busca um pedido pelo id passado na URL
async function get(req, res) {
    try {
        const { id } = req.params
        const order = await orderService.getOrder(id)

        if (!order) {
            return res.status(404).json({ message: "Pedido não encontrado" })
        }

        res.json(order)
    } catch (error) {
        handleError(res, error)
    }
}

// Retorna todos os pedidos cadastrados
async function list(req, res) {
    try {
        const orders = await orderService.listOrders()
        res.json(orders)
    } catch (error) {
        handleError(res, error)
    }
}

// Atualiza os dados de um pedido existente
async function update(req, res) {
    try {
        const { id } = req.params

        // Verifica se o pedido existe antes de tentar atualizar
        const existing = await orderService.getOrder(id)
        if (!existing) {
            return res.status(404).json({ message: `Pedido ${id} não encontrado` })
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Nenhum dado enviado para atualização" })
        }

        const mappedOrder = mapOrder(req.body)
        const order = await orderService.updateOrder(id, mappedOrder)
        res.json(order)
    } catch (error) {
        handleError(res, error)
    }
}

// Remove um pedido pelo id passado na URL
async function remove(req, res) {
    try {
        const { id } = req.params

        // Verifica se o pedido existe antes de tentar deletar
        const existing = await orderService.getOrder(id)
        if (!existing) {
            return res.status(404).json({ message: "Pedido não encontrado" })
        }

        await orderService.deleteOrder(id)
        res.json({ message: "Pedido deletado com sucesso" })
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = {
    create,
    get,
    list,
    update,
    remove
}