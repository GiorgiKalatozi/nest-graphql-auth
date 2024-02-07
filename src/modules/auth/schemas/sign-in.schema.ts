import * as Joi from 'joi';

const emailSchema = Joi.string().email().required().messages({
  'string.base': 'Email must be a string',
  'string.email': 'Please enter a valid email address',
  'any.required': 'Email is required',
});

const passwordSchema = Joi.string().min(8).required().messages({
  'any.required': 'Password is required',
});

export const signInSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
