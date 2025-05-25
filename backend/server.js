require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const empresaCheckout = require("./api/create-empresa-checkout-session");
const usuarioCheckout = require("./api/create-usuario-checkout-session");

app.get("/", (req, res) => {
  res.send("Backend rodando");
});

app.post("/create-empresa-checkout-session", (req, res) => empresaCheckout(req, res));
app.post("/create-usuario-checkout-session", (req, res) => usuarioCheckout(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
