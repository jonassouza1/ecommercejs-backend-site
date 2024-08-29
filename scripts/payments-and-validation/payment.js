const { MercadoPagoConfig, Preference } = require("mercadopago");
const { getIdPreference } = require("../notification/notification.js");
require("dotenv").config({ path: "../../.env.development" });

const TOKEN = process.env.MP_ACCESS_TOKEN;
const client = new MercadoPagoConfig({ accessToken: TOKEN });
const preferences = new Preference(client);

function createItems(itemsData) {
  return itemsData.map((item) => ({
    title: `${item.product}`,
    unit_price: Number(item.amount),
    quantity: Number(item.quantity),
    currency_id: "BRL",
    description: `Produto: ${item.description}, Tamanho: ${item.size}`,
    metadata: {
      size: item.size,
    },
  }));
}

function createShipments(formData) {
  return {
    receiver_address: {
      zip_code: formData.zip,
      street_name: formData.address,
      street_number: Number(formData.street_number),
      floor: formData.floor,
      apartment: formData.apartment,
      city_name: formData.city,
      state_name: formData.state,
      country_name: formData.country_name,
    },
  };
}

function preferencePayment(data, req, res) {
  if (!data.items || data.items.length === 0) {
    return res.status(400).json({ message: "Adicione Itens" });
  }

  const items = createItems(data.items);
  const shipments = createShipments(data.formData);
  const preferenceData = {
    items,
    shipments,
    payer: {
      name: data.formData.name,
      email: data.formData.email,
      phone: {
        number: data.formData.phone,
      },
    },
    back_urls: {
      success: "http://localhost:5500/pages/sucess.html",
      failure: "http://localhost:5500/pages/failed.html",
      pending: "http://localhost:5500/pages/pending.html",
    },
    auto_return: "approved",
  };

  preferences
    .create({ body: preferenceData })
    .then((response) => {
      if (response.id) {
        getIdPreference(response.id);
      }
      res.json({ init_point: response.init_point });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
}

module.exports = { preferencePayment };
