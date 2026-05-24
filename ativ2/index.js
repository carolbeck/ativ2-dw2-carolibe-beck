
import './create-db.js';
import express from "express";
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

async function init() {
  try {
    const dbCreator = await import("./create-db.js");
    if (dbCreator.createDatabase) {
      await dbCreator.createDatabase();
    }

    const ClienteController = (await import("./controllers/ClienteController.js")).default;
    const ProdutoController = (await import("./controllers/ProdutoController.js")).default;
    const PedidoController = (await import("./controllers/PedidoController.js")).default;
    const UsuarioController = (await import("./controllers/UsuarioController.js")).default;

    const Cliente = (await import("./models/Cliente.js")).default;
    const Pedido = (await import("./models/Pedido.js")).default;
    const Produto = (await import("./models/Produto.js")).default;
    const makeAssociations = (await import("./config/associations.js")).default;

    // Fazer associações antes de usar as rotas
    makeAssociations();

    app.use("/", ClienteController);
    app.use("/", ProdutoController);
    app.use("/", PedidoController);
    app.use("/", UsuarioController);

    // restante das rotas e inicialização do servidor
    app.get("/", function (req, res) {
      res.render("index");
    });

    app.get("/perfil", function (req, res) {
      const usuario = {
        nome: "Caroline",
        cargo: "Especialista Wella",
        unidade: "Registro-SP",
      };
      res.render("perfil", { user: usuario, message: null });
    });

    app.post("/perfil", async function (req, res) {
      const usuario = {
        nome: "Caroline",
        cargo: "Especialista Wella",
        unidade: "Registro-SP",
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
        const sequelize = (await import("./config/sequelize-config.js")).default;
        // Sincroniza todos os models (cria tabelas ausentes). Evita ALTER para não gerar conflitos de índices.
        await sequelize.sync();
        console.log("Todos os models sincronizados (criação de tabelas) com sucesso.");

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
        console.error("Erro ao sincronizar os models:", error);
      }
    }

    startServer(defaultPort);
  } catch (err) {
    console.error("Erro na inicialização:", err);
  }
}

init();
init();