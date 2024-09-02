const fetch = require("node-fetch");
require("dotenv").config({ path: "../../.env.development" });

const baseUrl = process.env.API_URL || "http://localhost:5502/products";
console.log(baseUrl);
async function getProductName(req, res) {
  let { name } = req.params;
  name.trim();
  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(name)}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer a requisição`);
    }

    const products = await response.json();
    res.status(200).json(products); // Envie a resposta JSON para o cliente
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
}

module.exports = { getProductName };
