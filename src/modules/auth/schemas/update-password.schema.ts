import * as Joi from 'joi';

const currentPasswordSchema = Joi.string().min(8).required().messages({
  'string.base': 'Current password must be a string',
  'string.min': 'Current password must be at least 8 characters long',
  'any.required': 'Current password is required',
});

const newPasswordSchema = Joi.string().min(8).required().messages({
  'string.base': 'New password must be a string',
  'string.min': 'New password must be at least 8 characters long',
  'any.required': 'New password is required',
});

const confirmNewPasswordSchema = Joi.string()
  .valid(Joi.ref('newPassword'))
  .required()
  .messages({
    'string.base': 'Confirm new password must be a string',
    'any.only': 'Confirm new password must match new password',
    'any.required': 'Confirm new password is required',
  });

export const updatePasswordSchema = Joi.object({
  currentPassword: currentPasswordSchema,
  newPassword: newPasswordSchema,
  confirmNewPassword: confirmNewPasswordSchema,
});
