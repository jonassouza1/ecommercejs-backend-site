# 🧠 E-commerce Backend — Payments & Notifications API

This is the **main backend for handling payments** in a modular e-commerce system. Built with **Node.js + Express**, it handles **payment processing via Mercado Pago**, manages **webhook notifications**, and sends **automated email confirmations** to the seller after a successful purchase.

> ⚠️ This project is **just one part of a full application**, which also includes:
> - [`frontend`](https://github.com/jonassouza1/ecommercejs-frontend-site): Customer-facing interface
> - [`backend-db`](https://github.com/jonassouza1/ecommercejs-database): Database API using PostgreSQL/Neon

---

## 🚀 Technologies Used

- **Node.js 18+**
- **Express.js**
- **Mercado Pago SDK**
- **Nodemailer** — email sending
- **Dotenv** — environment variable management
- **Express Validator** — request validation
- **CORS** — cross-origin resource sharing
- **Node-Fetch** — raw HTTP requests

---

## ⚙️ Core Features

### 💳 Payment Integration (Mercado Pago)

- Generates *payment preferences* via API
- Secure redirection to **Checkout Pro**
- Supports **Mercado Envios (ME2)** with automatic shipping calculation
- Receives order updates via **webhooks**

### 📩 Automated Email Notifications

- Sends confirmation email to the seller after successful payment
- Uses `nodemailer` with support for Gmail, Outlook, etc.

### 🔒 Security & Validation

- Validates incoming requests using `express-validator`
- Cross-origin access control with CORS middleware
- Environment variables stored securely in a `.env` file

---

## 📁 File Structure (Simplified)

```bash
.
├── index.js                   # Main entry point of the server
├── package.json              # Project settings and dependencies
├── scripts/                  # Main folder containing all backend logic
│   ├── notification/         # Webhook handlers for Mercado Pago status updates
│   ├── payments-and-validation/  # Payment preference creation & input validation
│   ├── products/             # search for products in the second backend
│   └── send-notification/    # Email sending logic using Nodemailer

