
import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

const vendedores = [
    {nome: "Mariana Lima", cargo: "Consultora de Beleza", especialidade: "Coloração & Tonalização", telefone: "(11) 91234-5678"},
    {nome: "Beatriz Moura", cargo: "Especialista em Cortes", especialidade: "Estilo e Volume", telefone: "(11) 98765-4321"},
    {nome: "Camila Souza", cargo: "Coach de Tratamento", especialidade: "Nutrição Capilar", telefone: "(11) 99876-5432"}
];

router.get("/clientes", async function(req,res){
  try {
    const clientes = await Cliente.findAll({ order: [["id", "ASC"]] });
    res.render("clientes", {
      clientes,
      vendedores
    });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).send("Erro ao carregar clientes.");
  }
});

export default router;