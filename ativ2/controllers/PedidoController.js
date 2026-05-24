
import express from "express";
import Pedido from "../models/Pedido.js";
import Cliente from "../models/Cliente.js";
import Produto from "../models/Produto.js";

const router = express.Router();

router.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Cliente, attributes: ["id", "nome"] },
        { model: Produto, attributes: ["id", "nome", "preco"], through: { attributes: [] } },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.render("pedidos", { pedidos });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).send("Erro ao carregar pedidos.");
  }
});

router.get("/pedidos/cadastro", async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ attributes: ["id", "nome"] });
    const produtos = await Produto.findAll({ attributes: ["id", "nome", "preco"] });
    res.render("cadastroPedido", { clientes, produtos });
  } catch (error) {
    console.error("Erro ao carregarpágina de cadastro:", error);
    res.status(500).send("Erro ao carregar página de cadastro.");
  }
});

router.post("/pedidos/cadastrar", async (req, res) => {
  const { clienteId, total, produtosIds } = req.body;
  try {
    const pedido = await Pedido.create({
      clienteId,
      total: parseFloat(total) || 0,
    });

    if (produtosIds && produtosIds.length > 0) {
      const ids = Array.isArray(produtosIds) ? produtosIds : [produtosIds];
      await pedido.addProdutos(ids.map(id => parseInt(id)));
    }

    res.redirect("/pedidos");
  } catch (error) {
    console.error("Erro ao cadastrar pedido:", error);
    res.status(500).send("Não foi possível cadastrar o pedido.");
  }
});

export default router;