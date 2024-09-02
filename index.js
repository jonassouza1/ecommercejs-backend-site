const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config({ path: ".env.development" });
const { webhook } = require("./scripts/notification/webhook.js");
const {
  preferencePayment,
} = require("./scripts/payments-and-validation/payment.js");
const {
  validatePaymentData,
  handleValidationErrors,
} = require("./scripts/payments-and-validation/validatesData.js");
const { getProducts } = require("./scripts/products/getProducts.js");
const { getProductName } = require("./scripts/products/getProductName.js");

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.post(
  "/createpayment",
  validatePaymentData, // Validação dos dados
  handleValidationErrors, // Tratamento dos erros de validação
  async (req, res) => {
    const data = req.body;
    preferencePayment(data, req, res);
  }
);

app.post("/webhook", (req, res) => {
  webhook(req, res);
});

app.get("/products", async (req, res) => {
  await getProducts(req, res);
});
app.get("/products/:name", async (req, res) => {
  await getProductName(req, res);
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log do erro no servidor
  res.status(500).json({ message: "Ocorreu um erro no servidor!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`O servidor está sendo executado na porta ${PORT}`);
});
