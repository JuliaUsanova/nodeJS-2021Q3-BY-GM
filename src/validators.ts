import * as Joi from 'joi';
import { ContainerTypes, createValidator, ValidatedRequestSchema } from 'express-joi-validation';
import { BaseUserAttributes } from './types/user';
import { User } from './models/user.model';

const loginValidator = async (value: string) => {
	let users = [] as User[];

	try {
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve(value);
			}, 300);
		});
		// users = await User.findAll({ attributes: ['login'] });
	} catch (e) {
		console.log('no users in the table');
	}

	if (users.length && users.find((u) => u.login === value)) {
		throw new Error(`The login name ${value} is already used`);
		// return helper.message({ custom: `The login name ${value} is already used` });
	} else {
		return value;
	}
};

export const validator = createValidator({ passError: true });
export const baseUserBodySchema = Joi.object<BaseUserAttributes>({
	age: Joi.number().integer().min(4).max(130).required(),
	password: Joi.string().alphanum().required(),
	login: Joi.string().required()
});

export const asyncUserBodySchema = Joi.object<BaseUserAttributes>({
	login: Joi.string()
		.required()
		.external(async (body) => await loginValidator(body.login))
	// age: Joi.number().integer().min(4).max(130).required(),
	// password: Joi.string().alphanum().required()
});
// export const asyncUserBodySchema = (body: BaseUserAttributes) =>
// 	Joi.object<BaseUserAttributes>({
// 		login: Joi.string().required().external(loginValidator).validateAsync(body.login),
// 		age: Joi.number().integer().min(4).max(130).required(),
// 		password: Joi.string().alphanum().required()
// 	});

export interface BaseUserSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: BaseUserAttributes;
}
