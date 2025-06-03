require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const empresaCheckout = require("./api/create-empresa-checkout-session");

app.get("/", (req, res) => {
  res.send("Backend rodando");
});

app.post("/create-empresa-checkout-session", (req, res) => empresaCheckout(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
