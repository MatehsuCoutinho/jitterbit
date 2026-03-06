# 🛒 Orders API

API REST para gerenciamento de pedidos com autenticação JWT, construída com **Node.js**, **Express** e **Prisma ORM**.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Documentação Swagger](#-documentação-swagger)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Endpoints](#-endpoints)
- [Autenticação](#-autenticação)
- [Validações](#-validações)
- [Formato dos Dados](#-formato-dos-dados)

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JSON Web Token (JWT)](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Zod](https://zod.dev/) — validação de dados
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) — documentação

---

## 📦 Pré-requisitos

- Node.js v18+
- PostgreSQL rodando localmente ou em nuvem
- npm ou yarn

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/MatehsuCoutinho/jitterbit
cd seu-repositorio

# Instale as dependências
npm install
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_secreta_aqui"
```

| Variável       | Descrição                              |
|----------------|----------------------------------------|
| `DATABASE_URL` | String de conexão com o PostgreSQL     |
| `JWT_SECRET`   | Chave secreta para assinar tokens JWT  |

---

## 🗄️ Banco de Dados

O projeto usa **Prisma** com PostgreSQL. Para configurar o banco:

```bash
# Gera o cliente Prisma
npx prisma generate

# Executa as migrations
npx prisma migrate dev

# (Opcional) Abre o Prisma Studio para visualizar os dados
npx prisma studio
```

### Modelos

**User**
| Campo      | Tipo    | Descrição              |
|------------|---------|------------------------|
| `id`       | Int     | Chave primária (auto)  |
| `email`    | String  | Único                  |
| `password` | String  | Criptografado (bcrypt) |

**Order**
| Campo          | Tipo     | Descrição             |
|----------------|----------|-----------------------|
| `orderId`      | String   | Chave primária        |
| `value`        | Float    | Valor total           |
| `creationDate` | DateTime | Data de criação       |
| `items`        | Item[]   | Itens do pedido       |

**Item**
| Campo       | Tipo   | Descrição                    |
|-------------|--------|------------------------------|
| `id`        | Int    | Chave primária (auto)        |
| `orderId`   | String | Referência ao pedido         |
| `productId` | Int    | ID do produto                |
| `quantity`  | Int    | Quantidade                   |
| `price`     | Float  | Preço unitário               |

---

## ▶️ Rodando o Projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará disponível em `http://localhost:3000`.

---

## 📖 Documentação Swagger

Com o servidor rodando, acesse:

```
http://localhost:3000/docs
```

A documentação interativa permite visualizar todos os endpoints e testá-los diretamente pelo navegador, incluindo autenticação via token JWT pelo botão **Authorize 🔒**.

---

## 📁 Estrutura de Pastas

```
src/
├── config/
│   └── prisma.js           # Instância do Prisma Client
├── controllers/
│   ├── auth.controller.js  # Lógica de autenticação
│   └── order.controller.js # Lógica de pedidos
├── middlewares/
│   └── auth.middleware.js  # Validação do token JWT
├── routes/
│   ├── auth.routes.js      # Rotas de autenticação
│   └── order.routes.js     # Rotas de pedidos
├── services/
│   ├── auth.service.js     # Regras de negócio de autenticação
│   └── order.service.js    # Regras de negócio de pedidos
└── utils/
    └── orderMapper.js      # Mapeamento dos campos do pedido
server.js                   # Ponto de entrada da aplicação
swagger.yaml                # Documentação OpenAPI
prisma/
└── schema.prisma           # Schema do banco de dados
```

---

## 🛣️ Endpoints

### Auth

| Método | Rota             | Descrição                        | Auth |
|--------|------------------|----------------------------------|------|
| POST   | `/auth/register` | Registra um novo usuário         | ❌   |
| POST   | `/auth/login`    | Autentica e retorna o token JWT  | ❌   |

### Orders

| Método | Rota            | Descrição                     | Auth |
|--------|-----------------|-------------------------------|------|
| POST   | `/order`        | Cria um novo pedido           | ✅   |
| GET    | `/order/list`   | Lista todos os pedidos        | ✅   |
| GET    | `/order/:id`    | Busca um pedido pelo ID       | ✅   |
| PUT    | `/order/:id`    | Atualiza um pedido existente  | ✅   |
| DELETE | `/order/:id`    | Remove um pedido              | ✅   |

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)**. Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer <seu_token_aqui>
```

O token tem validade de **1 dia**.

---

## ✅ Validações

A API usa **Zod v4** para validação. Erros retornam no seguinte formato:

```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "password",
      "message": "Deve conter ao menos uma letra maiúscula"
    },
    {
      "field": "password",
      "message": "Deve conter ao menos um número"
    }
  ]
}
```

### Regras de senha (registro)

- Mínimo de 8 caracteres
- Ao menos uma letra maiúscula
- Ao menos um número

---

## 📨 Formato dos Dados

O body de criação e atualização de pedidos usa campos em **português**, que são mapeados internamente pelo `orderMapper`:

```json
{
  "numeroPedido": "PED-001",
  "valorTotal": 99.98,
  "dataCriacao": "2024-01-15T10:30:00Z",
  "items": [
    {
      "idItem": "42",
      "quantidadeItem": 2,
      "valorItem": 49.99
    }
  ]
}
```

| Campo recebido   | Campo no banco  |
|------------------|-----------------|
| `numeroPedido`   | `orderId`       |
| `valorTotal`     | `value`         |
| `dataCriacao`    | `creationDate`  |
| `idItem`         | `productId`     |
| `quantidadeItem` | `quantity`      |
| `valorItem`      | `price`         |
