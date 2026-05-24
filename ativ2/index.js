
import express from "express";

import ClienteController from "./controllers/ClienteController.js";
import ProdutoController from "./controllers/ProdutoController.js";
import PedidoController from "./controllers/PedidoController.js";
import UsuarioController from "./controllers/UsuarioController.js";
import Cliente from "./models/Cliente.js";
import session from "express-session";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  session({
    secret: "sua_chave_secreta",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", ClienteController);
app.use("/", ProdutoController);
app.use("/", PedidoController);
app.use("/", UsuarioController);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/pedidos", (req, res) => {
  const listaPedidos = [
    { id: 101, cliente: "Ana Silva", item: "Kit Fusion Grande", status: "Enviado" },
    { id: 102, cliente: "Beatriz Souza", item: "Óleo Reflections 100ml", status: "Processando" },
    { id: 103, cliente: "Carla Pires", item: "Máscara Nutri-Enrich", status: "Entregue" },
    { id: 104, cliente: "Débora Lima", item: "Shampoo Color Brilliance", status: "Cancelado" },
    { id: 105, cliente: "Erica Matos", item: "Condicionador Elements", status: "Entregue" }
  ];
  res.render("pedidos", { 
    pedidos: listaPedidos 
  });
});

app.get("/perfil", function (req, res) {
  const usuario = {
    nome: "Caroline",
    cargo: "Especialista Wella",
    unidade: "Registro-SP"
  };
  res.render("perfil", { user: usuario, message: null });
});

app.post("/perfil", async function (req, res) {
  const usuario = {
    nome: "Caroline",
    cargo: "Especialista Wella",
    unidade: "Registro-SP"
  };

  const { nome, cpf, endereco, email } = req.body;
  let message = null;

  if (nome && cpf && endereco) {
    try {
      await Cliente.create({
        nome: nome.trim(),
        cpf: cpf.trim(),
        endereco: endereco.trim(),
        email: email ? email.trim() : null,
      });
      message = "Cadastro realizado com sucesso! Confira na página de clientes.";
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        message = "Este CPF já está cadastrado.";
      } else {
        message = "Não foi possível cadastrar o cliente.";
      }
    }
  } else {
    message = "Preencha nome, CPF e endereço para cadastrar.";
  }

  res.render("perfil", { user: usuario, message });
});

const defaultPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

async function startServer(port) {
  try {
    await Cliente.sync({ alter: true });
    console.log("Tabela de clientes sincronizada com sucesso.");
    const server = app.listen(port, () => {
      console.log(`Servidor iniciado com sucesso em: http://localhost:${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.log(`Porta ${port} em uso, tentando ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("Erro ao iniciar o servidor:", error);
      }
    });
  } catch (error) {
    console.error("Erro ao sincronizar a tabela de clientes:", error);
  }
}

startServer(defaultPort);