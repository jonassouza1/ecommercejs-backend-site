const fetch = require("node-fetch");
require("dotenv").config({ path: "../../.env.development" });
async function getProducts(req, res) {
  const { category_name } = req.query;

  try {
    // Construir a URL com base no parâmetro de query, se existir
    let url = "http://localhost:5502/products";
    if (category_name) {
      const query = new URLSearchParams({ category_name }).toString();
      url = `${url}?${query}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Remover espaço extra
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer a requisição`);
    }

    const products = await response.json(); // Obtenha a resposta em JSON

    res.status(200).json(products); // Envie a resposta JSON para o cliente
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
}

module.exports = { getProducts };
