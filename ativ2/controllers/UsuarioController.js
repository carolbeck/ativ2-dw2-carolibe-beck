import express from "express";
const router = express.Router();

import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

// rota de login (form)
router.get("/login", (req, res) => {
  res.render("login");
});

// rota do formulario de cadastro do usuario
router.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

// rota de criaçao de usuario no banco
router.post("/caduser", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario == undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(senha, salt);
      await Usuario.create({ email, senha: hash });
      return res.redirect("/login");
    } else {
      return res.send(`Usuario já cadastrado!<br><br><a href="/login">Faça o login</a>`);
    }
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).send("Erro ao cadastrar usuário.");
  }
});

// rota de autenticaçao (login)
router.post("/autenticacao", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario != undefined) {
      const correct = bcrypt.compareSync(senha, usuario.senha);
      if (correct) {
        req.session.usuario = {
          id: usuario.id,
          email: usuario.email,
        };
        return res.redirect("/");
      } else {
        return res.send(`Senha inválida!<br><a href="/login">Tente novamente.</a>`);
      }
    } else {
      return res.send(`O usuário informado não existe!<br><a href="/login">Tente novamente.</a>`);
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(500).send("Erro na autenticação.");
  }
});

export default router;
