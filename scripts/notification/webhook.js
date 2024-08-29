const crypto = require("crypto");
require("dotenv").config({ path: "../../.env.development" });
const { checkPaymentStatus } = require("./notification.js");

const secret = process.env.WEBHOOK_SECRET;
const processedNotifications = new Set();

const parseSignature = (xSignature) => {
  const parts = xSignature.split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return { ts: parts.ts, receivedSignature: parts.v1 };
};

const generateSignature = (dataID, xRequestId, ts) => {
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
  return crypto.createHmac("sha256", secret).update(manifest).digest("hex");
};

const webhook = (req, res) => {
  const { body, headers } = req;
  const { "x-signature": xSignature, "x-request-id": xRequestId } = headers;

  if (!xSignature || !xRequestId) {
    console.error("Missing headers:", { xSignature, xRequestId });
    return res.sendStatus(400);
  }

  const { ts, receivedSignature } = parseSignature(xSignature);
  if (!ts || !receivedSignature) {
    console.error("Timestamp or signature missing.", { ts, receivedSignature });
    return res.sendStatus(400);
  }

  const dataID = body?.data?.id;
  if (!dataID) {
    console.error("ID de pagamento ausente na notificação.", body);
    return res.sendStatus(400);
  }

  const generatedSignature = generateSignature(dataID, xRequestId, ts);
  if (generatedSignature !== receivedSignature) {
    console.error("Notificação inválida:", body);
    return res.sendStatus(400);
  }

  if (processedNotifications.has(dataID)) {
    console.log("Notificação duplicada ignorada:", dataID);
  } else {
    console.log("Nova notificação válida:", body);
    processedNotifications.add(dataID);
    checkPaymentStatus(dataID);
  }

  res.sendStatus(200);
};

module.exports = { webhook };
