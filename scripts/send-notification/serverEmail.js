const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env.development" });

let emailData = {
  status: null,
  data: null,
};

async function serverEmailNotification(status, data) {
  if (status) emailData.status = status;
  if (data) emailData.data = data;

  if (emailData.status && emailData.data) {
    await sendEmail(emailData.status, emailData.data);
    emailData = { status: null, data: null };
  }
}

async function sendEmail(status, data) {
  console.log("Enviando email com status e data:");
  console.log("Status:", status);
  console.log("Data:", data);

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, // true para SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Notificação de Status de Pagamento",
      html: `
        <h1>Notificação de Status de Pagamento</h1>
        <p><strong>Status:</strong> ${status}</p>
        <h2>Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${data.user.name}</p>
        <p><strong>Telefone:</strong> ${data.user.phone.number}</p>
        <p><strong>Email:</strong> ${data.user.email}</p>
        <h2>Endereço de Entrega</h2>
        <p><strong>CEP:</strong> ${data.address.zip_code}</p>
        <p><strong>Rua:</strong> ${data.address.street_name}</p>
        <p><strong>Número:</strong> ${data.address.street_number}</p>
        <p><strong>Cidade:</strong> ${data.address.city_name}</p>
        <p><strong>Estado:</strong> ${data.address.state_name}</p>
        <p><strong>País:</strong> ${data.address.country_name}</p>
        <h2>Produto Comprado</h2>
        ${data.productPurchased
          .map(
            (product) => `
          <div>
            <p><strong>Título:</strong> ${product.title}</p>
            <p><strong>Descrição:</strong> ${product.description}</p>
            <p><strong>Quantidade:</strong> ${product.quantity}</p>
            <p><strong>Preço Unitário:</strong> ${product.unit_price}</p>
          </div>
        `
          )
          .join("")}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado: " + info.response);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
}

module.exports = { serverEmailNotification };
