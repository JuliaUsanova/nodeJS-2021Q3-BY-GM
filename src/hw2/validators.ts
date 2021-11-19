import * as Joi from 'joi';
import { ContainerTypes, createValidator, ValidatedRequestSchema } from 'express-joi-validation';
import { BaseUserAttributes } from './types/user';
import { User } from './models/user.model';

export const validator = createValidator({ passError: true });
export const baseUserBodySchema = Joi.object({
	login: Joi.string()
		.custom(async (value, helper) => {
			const users = await User.findAll({ attributes: ['login'] });

			if (users.find((u) => u.login === value)) {
				return helper.message({ custom: `The login name ${value} is already used` });
			} else {
				return value;
			}
		})
		.required(),
	age: Joi.number().integer().min(4).max(130).required(),
	password: Joi.string().alphanum().required()
});

export interface BaseUserSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: BaseUserAttributes;
}
