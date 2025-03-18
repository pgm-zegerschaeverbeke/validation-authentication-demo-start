import { body } from "express-validator";

export default [
  body("email")
    .notEmpty()
    .withMessage("E-mail is een verplicht veld.")
    .bail()
    .isEmail()
    .withMessage("Onjuist e-mail adres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Wachtwoord moet bestaan uit minstens zes tekens."),
];