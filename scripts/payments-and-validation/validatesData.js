const { body, validationResult } = require("express-validator");

const validatePaymentData = [
  body("items")
    .isArray()
    .withMessage("Items deve ser um array")
    .notEmpty()
    .withMessage("Items não pode estar vazio"),

  body("items.*.product")
    .isString()
    .withMessage("O produto deve ser uma string")
    .trim()
    .escape(),

  body("items.*.amount")
    .isFloat({ min: 0 })
    .withMessage("O valor deve ser um número positivo"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("A quantidade deve ser um número inteiro positivo"),

  body("formData.name")
    .isString()
    .notEmpty()
    .withMessage("O nome é obrigatório")
    .trim()
    .escape(),
  body("formData.phone")
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)
    .withMessage(
      "Por favor, insira um número de telefone válido no formato (XX) XXXXX-XXXX."
    )
    .notEmpty()
    .withMessage("O número de telefone é obrigatório")
    .trim()
    .escape(),

  body("formData.email")
    .isEmail()
    .withMessage("O e-mail é inválido")
    .normalizeEmail(),

  body("formData.address")
    .isString()
    .notEmpty()
    .withMessage("O endereço é obrigatório")
    .trim()
    .escape(),

  body("formData.street_number")
    .optional()
    .isInt()
    .withMessage("O número da rua deve ser um número inteiro"),

  body("formData.city")
    .isString()
    .notEmpty()
    .withMessage("A cidade é obrigatória")
    .trim()
    .escape(),

  body("formData.state")
    .isString()
    .notEmpty()
    .withMessage("O estado é obrigatório")
    .trim()
    .escape(),

  body("formData.zip")
    .isString()
    .notEmpty()
    .withMessage("O CEP é obrigatório")
    .trim()
    .escape(),

  body("formData.country_name")
    .optional()
    .isString()
    .withMessage("O nome do país deve ser uma string")
    .trim()
    .escape(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validatePaymentData, handleValidationErrors };
