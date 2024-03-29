import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000).required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  REDIS_PORT: Joi.number().default(6379).required(),
  REDIS_HOST: Joi.string().required(),
  ELASTICSEARCH_NODE: Joi.string().required(),
  ELASTICSEARCH_INDEX: Joi.string().required(),
});
