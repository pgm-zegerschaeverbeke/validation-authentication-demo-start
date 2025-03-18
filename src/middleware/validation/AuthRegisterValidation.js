import { body } from "express-validator";

export default [
  body("firstname").notEmpty().withMessage("Voornaam is een verplicht veld."),
  body("lastname").notEmpty().withMessage("Achternaam is een verplicht veld."),
  body("email")
    .notEmpty()
    .withMessage("E-mail is een verplicht veld.")
    .bail()
    .isEmail()
    .withMessage("Onjuist e-mail adres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Wachtwoord moet bestaan uit minstens zes tekens."),
  body("role").notEmpty().withMessage("De gebruiker heeft een rol nodig."),
];
