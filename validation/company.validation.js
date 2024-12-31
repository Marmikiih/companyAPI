const Joi = require("joi");

const getCompanySchema = Joi.object({
  id: Joi.number().messages({
    "number.base": "ID must be a number.",
    "number.integer": "ID must be an integer.",
    "number.greater": "ID must be greater than 0."
  }),
});

const createCompanySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name is required and cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is a required field.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email is required and cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  }),
  password: Joi.string().min(8).max(30).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password is required and cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 30 characters.",
    "any.required": "Password is a required field.",
  }),
});

const loginCompanySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email is required and cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  }),
  password: Joi.string().min(8).max(30).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password is required and cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 30 characters.",
    "any.required": "Password is a required field.",
  }),
});

const emailOnlySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email is required and cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "token must be a text string.",
    "any.required": "token is a required field.",
  }),
  newPassword: Joi.string().min(8).max(30).required().messages({
    "string.base": "New Password must be a text string.",
    "string.empty": "New Password is required and cannot be empty.",
    "string.min": "New Password must be at least 8 characters long.",
    "string.max": "New Password cannot exceed 30 characters.",
    "any.required": "New Password is a required field.",
  }),
  confirmPassword: Joi.string().min(8).max(30).required().messages({
    "string.base": "Confirm Password must be a text string.",
    "string.empty": "Confirm Password is required and cannot be empty.",
    "string.min": "Confirm Password must be at least 8 characters long.",
    "string.max": "Confirm Password cannot exceed 30 characters.",
    "any.required": "Confirm Password is a required field.",
  }),
});

const inviteMemberSchema = Joi.object({
  companyId: Joi.number().required().messages({
    "number.base": "Company ID must be a number.",
    "number.empty": "Company ID is required and cannot be empty.",
    "any.required": "Company ID is a required field.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text string.",
    "string.empty": "Email is required and cannot be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is a required field.",
  }),
});

const acceptInvitationSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.base": "token must be a text string.",
    "any.required": "token is a required field.",
  }),
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a text string.",
    "string.empty": "Name is required and cannot be empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is a required field.",
  }),
  password: Joi.string().min(8).max(30).required().messages({
    "string.base": "Password must be a text string.",
    "string.empty": "Password is required and cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 30 characters.",
    "any.required": "Password is a required field.",
  }),
  confirmPassword: Joi.string().min(8).max(30).required().messages({
    "string.base": "Confirm Password must be a text string.",
    "string.empty": "Confirm Password is required and cannot be empty.",
    "string.min": "Confirm Password must be at least 8 characters long.",
    "string.max": "Confirm Password cannot exceed 30 characters.",
    "any.required": "Confirm Password is a required field.",
  }),
});

module.exports = {
  getCompanySchema,
  createCompanySchema,
  loginCompanySchema,
  emailOnlySchema,
  resetPasswordSchema,
  inviteMemberSchema,
  acceptInvitationSchema
};
