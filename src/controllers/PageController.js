import { validationResult } from "express-validator";

/**
 * A Page Controller
 */

export const home = async (req, res) => {
  res.render("home", {});
};

/*
 * A contact page
 */
export const contact = (req, res) => {
  const inputs = [
    {
      name: "fullname",
      label: "Volledige naam",
      type: "text",
      err: req.formErrorFields?.fullname ? req.formErrorFields["fullname"] : "",
      value: req.body?.fullname ? req.body.fullname : "",
    },
    {
      name: "email",
      label: "E-mail",
      type: "text",
      err: req.formErrorFields?.email ? req.formErrorFields["email"] : "",
      value: req.body?.email ? req.body.email : "",
    },
    {
      name: "message",
      label: "Bericht",
      type: "textarea",
      err: req.formErrorFields?.message ? req.formErrorFields["message"] : "",
      value: req.body?.message ? req.body.message : "",
    },
  ];

  const flash = req.flash || {};

  res.render("contact", {
    inputs,
    flash,
  });
};

/**
 * This function handles the post request for the contact page
 */
export const postContact = async (req, res, next) => {
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
  }

  try {
    // let us send an email
    console.log("Yay, we could send Georgette an email now");

    // set the flash message
    req.flash = {
      type: "success",
      message: "Uw bericht is verzonden",
    };

    // empty the form fields
    req.body = {};

    return next();
  } catch (error) {
    console.error(error);
  }
};
