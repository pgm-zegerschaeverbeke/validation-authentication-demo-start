/**
 * An auth controller that handles login, register, and logout
 */
import Role from "../models/Role.js";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
/**
 * Login
 */
export const login = async (req, res) => {
  const inputs = [
    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  // get the roles
  const flash = req.flash || {};

  // render the register page

  res.render("login", {
    layout: "layouts/authentication",
    inputs,
    flash,
  });
};
export const postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // if we have validation errors
    if (!errors.isEmpty()) {
      // set the form error fields
      req.formErrorFields = {};
      errors.array().forEach((error) => {
        req.formErrorFields[error.path] = error.msg;
      });

      // set the flash message
      req.flash = {
        type: "danger",
        message: "Er zijn fouten opgetreden",
      };

      return next();
    } else {
      const user = await User.query().findOne({ email: req.body.email });

      // validate if the user already exists
      if (!user) {
        req.flash = {
          type: "danger",
          message: "Gebruiker met dit e-mailadres bestaat niet",
        };
        req.formErrorFields = { email: "Gebruiker met dit e-mailadres bestaat niet" };
        return next();
      }

      if (user) {
        const passwordMatches = bcrypt.compare( user.password , req.body.password)
        if (!passwordMatches) {
          req.flash = {
            type: "danger",
            message: "Password is onjuist",
          };
          req.formErrorFields = { password: "Password is onjuist" };
          return next();
        } else {
          res.redirect("/");
        }
      }

      


      


      // redirect to the home page

    }
  } catch (e) {
    next(e.message);
  }
};

/**
 * Register
 */
export const register = async (req, res) => {
  // input fields
  const inputs = [
    {
      name: "firstname",
      label: "Voornaam",
      type: "text",
      value: req.body?.firstname ? req.body.firstname : "",
      err: req.formErrorFields?.firstname ? req.formErrorFields.firstname : "",
    },
    {
      name: "lastname",
      label: "Achternaam",
      type: "text",
      value: req.body?.lastname ? req.body.lastname : "",
      err: req.formErrorFields?.lastname ? req.formErrorFields.lastname : "",
    },
    {
      name: "email",
      label: "E-mail",
      type: "text",
      value: req.body?.email ? req.body.email : "",
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      err: req.formErrorFields?.password ? req.formErrorFields.password : "",
    },
  ];

  // get the roles
  const roles = await Role.query();
  const flash = req.flash || {};

  // render the register page
  res.render("register", {
    layout: "layouts/authentication",
    inputs,
    roles,
    flash,
  });
};

export const postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    // if we have validation errors
    if (!errors.isEmpty()) {
      // set the form error fields
      req.formErrorFields = {};
      errors.array().forEach((error) => {
        req.formErrorFields[error.path] = error.msg;
      });

      // set the flash message
      req.flash = {
        type: "danger",
        message: "Er zijn fouten opgetreden",
      };

      return next();
    } else {
      const user = await User.query().findOne({ email: req.body.email });
      const role = await Role.query().findOne({ id: req.body.role });

      // validate if the role exists in the database
      if (!role) {
        req.flash = { type: "danger", message: "Deze rol bestaat niet." };
        req.formErrorFields = { role: "Deze rol bestaat niet." };
        return next();
      }
      // validate if the user already exists
      if (user) {
        req.flash = {
          type: "danger",
          message: "Dit e-mail adres is al in gebruik.",
        };
        req.formErrorFields = { email: "Dit e-mail adres is al in gebruik." };
        return next();
      }

      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      // create user
      await User.query().insert({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        role_id: parseInt(req.body.role),
      });

      // redirect to the login page
      res.redirect("/login");
    }
  } catch (e) {
    next(e.message);
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {};
