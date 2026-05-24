import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

const vendedores = [
    {nome: "Mariana Lima", cargo: "Consultora de Beleza", especialidade: "Coloração & Tonalização", telefone: "(11) 91234-5678"},
    {nome: "Beatriz Moura", cargo: "Especialista em Cortes", especialidade: "Estilo e Volume", telefone: "(11) 98765-4321"},
    {nome: "Camila Souza", cargo: "Coach de Tratamento", especialidade: "Nutrição Capilar", telefone: "(11) 99876-5432"}
];

router.get("/clientes", async function(req, res){
  try {
    const clientes = await Cliente.findAll({ order: [["id", "ASC"]] });
    res.render("clientes", { clientes, vendedores, editando: null });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).send("Erro ao carregar clientes.");
  }
});

// Abrir formulário de edição
router.get("/clientes/editar/:id", async function(req, res){
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.redirect("/clientes");
    const clientes = await Cliente.findAll({ order: [["id", "ASC"]] });
    res.render("clientes", { clientes, vendedores, editando: cliente });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).send("Erro ao buscar cliente.");
  }
});

// Salvar edição
router.post("/clientes/editar/:id", async function(req, res){
  const { nome, cpf, endereco, email } = req.body;
  try {
    await Cliente.update(
      { nome: nome.trim(), cpf: cpf.trim(), endereco: endereco.trim(), email: email ? email.trim() : null },
      { where: { id: req.params.id } }
    );
    res.redirect("/clientes");
  } catch (error) {
    console.error("Erro ao editar cliente:", error);
    res.status(500).send("Erro ao editar cliente.");
  }
});

// Excluir cliente
router.post("/clientes/excluir/:id", async function(req, res){
  try {
    await Cliente.destroy({ where: { id: req.params.id } });
    res.redirect("/clientes");
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).send("Erro ao excluir cliente.");
  }
});

export default router;