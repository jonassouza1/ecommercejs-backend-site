const fetch = require("node-fetch");
const {
  serverEmailNotification,
} = require("../send-notification/serverEmail.js");

require("dotenv").config({ path: "../../.env.development" });

const TOKEN = process.env.MP_ACCESS_TOKEN;

const apiUrl = (endpoint) => `https://api.mercadopago.com${endpoint}`;

const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(apiUrl(endpoint), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao consultar a API:", error);
    throw error;
  }
};

async function checkPaymentStatus(paymentId) {
  if (!paymentId) {
    console.log("ID do pagamento não fornecido");
    console.error("ID do pagamento não fornecido");
    return;
  }

  const paymentData = await fetchFromApi(`/v1/payments/${paymentId}`);
  const status = paymentData.status;
  await serverEmailNotification(status, null);
}

async function getIdPreference(id) {
  if (!id) {
    console.log("ID da preferência de pagamento não fornecido");
    console.error("ID da preferência de pagamento não fornecido");
    return;
  }

  const preferenceData = await fetchFromApi(`/checkout/preferences/${id}`);

  const data = {
    user: preferenceData.payer,
    address: preferenceData.shipments?.receiver_address,
    productPurchased: preferenceData.items,
  };

  await serverEmailNotification(null, data);
}

module.exports = { checkPaymentStatus, getIdPreference };
