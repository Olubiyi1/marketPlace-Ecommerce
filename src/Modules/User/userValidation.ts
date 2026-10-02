import Joi from "joi";
import { validationMessages } from "../../Utils/validationMessages.js";

export const registeruserValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages(validationMessages.firstName),

  lastName: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages(validationMessages.lastName),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: false })
    .required()
    .messages(validationMessages.email),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
      ),
    )
    .required()
    .messages(validationMessages.password),
});

export const userLoginValidationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: false })
    .required()
    .messages(validationMessages.email),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
      ),
    )
    .required()
    .messages(validationMessages.password)
});
