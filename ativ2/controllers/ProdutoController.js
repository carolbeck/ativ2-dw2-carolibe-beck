import express from "express";
import Produto from "../models/Produto.js";
const router = express.Router();

router.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.findAll({ order: [["id", "ASC"]] });
    res.render("produtos", { produtos });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).send("Erro ao carregar produtos.");
  }
});

router.get("/produtos/cadastro", (req, res) => {
  res.render("cadastroProduto");
});

router.post("/produtos/cadastrar", async (req, res) => {
  const { nome, linha, indicacao, descricao, preco, imagem, icone } = req.body;
  try {
    let imagemFinal = imagem ? imagem.trim() : null;
    if (imagemFinal && !imagemFinal.match(/^(https?:\/\/|\/)/i)) {
      imagemFinal = `/imgs/${imagemFinal}`;
    }

    await Produto.create({
      nome,
      linha,
      indicacao,
      descricao,
      preco: parseFloat(preco) || 0,
      imagem: imagemFinal,
      icone,
    });
    res.redirect("/produtos");
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).send("Não foi possível cadastrar o produto.");
  }
});

export default router;
