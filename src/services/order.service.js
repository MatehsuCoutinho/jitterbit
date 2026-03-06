const prisma = require("../config/prisma")
const { z } = require("zod")

// Schema de validação dos dados do pedido antes de salvar no banco
const orderSchema = z.object({
    orderId: z.string().min(1, "orderId é obrigatório"),
    value: z.number().positive("Valor deve ser positivo"),
    creationDate: z.coerce.date("Data inválida"),
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive("Quantidade deve ser inteira e positiva"),
        price: z.number().positive("Preço deve ser positivo")
    })).min(1, "Pedido deve ter ao menos um item")
})

// Cria um novo pedido com seus itens
async function createOrder(data) {
    orderSchema.parse(data)

    // Verifica se já existe um pedido com o mesmo orderId
    const existing = await prisma.order.findUnique({
        where: { orderId: data.orderId }
    })
    if (existing) throw new Error(`Pedido ${data.orderId} já existe`)

    return prisma.order.create({
        data: {
            orderId: data.orderId,
            value: data.value,
            creationDate: data.creationDate,
            items: { create: data.items }
        },
        include: { items: true }
    })
}

// Busca um pedido pelo orderId
async function getOrder(orderId) {
    return prisma.order.findUnique({
        where: { orderId },
        include: { items: true }
    })
}

// Retorna todos os pedidos
async function listOrders() {
    return prisma.order.findMany({
        include: { items: true }
    })
}

// Atualiza um pedido — recria os itens para refletir as mudanças
async function updateOrder(orderId, data) {

    // Remove os itens antigos antes de inserir os novos
    await prisma.item.deleteMany({
        where: { orderId }
    })

    return prisma.order.update({
        where: { orderId },
        data: {
            value: data.value,
            creationDate: data.creationDate,
            items: { create: data.items }
        },
        include: { items: true }
    })
}

// Remove o pedido e seus itens do banco
async function deleteOrder(orderId) {

    await prisma.item.deleteMany({
        where: { orderId }
    })

    return prisma.order.delete({
        where: { orderId }
    })
}

module.exports = {
    createOrder,
    getOrder,
    listOrders,
    deleteOrder,
    updateOrder
}