import { UserRequest as Request } from '../typings';
import { NextFunction, Response } from 'express';
import { User } from '../models/user.model';
import { BaseUserAttributes, IUserAttributes } from '../types/user';
import { ParsedQs } from 'qs';
import * as winston from 'winston';
import { transports } from 'winston';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseUserSchema } from '../validators/schemas';

const logger = winston.createLogger({
	transports: [new transports.Console()]
});

export const getUserById = async (
	req: Request,
	res: Response<Record<string, string>>,
	next: NextFunction,
	id: string
) => {
	logger.info('Trying to fetch user by id ', id);

	try {
		const user = (await User.findByPk(id)) ?? undefined;
		if (!user) {
			return res.status(404).json({ message: `User with id ${id} is not found` });
		}
		req.user = user;
		next();
	} catch (e) {
		next(e);
	}
};

export const readUser = (
	{ user }: Request<{ id: string }, IUserAttributes, {}, {}, Record<string, BaseUserAttributes>>,
	res: Response<User>,
	next: NextFunction
) => {
	try {
		res.json(user);
	} catch (e) {
		next(e);
	}
};

export const updateUser = async (
	{
		user,
		body
	}: Request<{ id: string }, IUserAttributes, BaseUserAttributes, {}, Record<string, BaseUserAttributes>>,
	res: Response<User>,
	next: NextFunction
) => {
	try {
		const { login, password, age } = body;

		user!.updateDetails(login, password, age);
		await user!.save();

		res.status(200).json(user);
	} catch (e) {
		next(e);
	}
};

export const deleteUser = async (
	{ user }: Request<{ id: string }, {}, {}, {}, Record<string, BaseUserAttributes>>,
	res: Response<number>,
	next: NextFunction
) => {
	try {
		await user!.destroy();
		res.status(200).send();
	} catch (e) {
		next(e);
	}
};

export const getAutoSuggestedUsers = async (
	req: Request<{}, IUserAttributes[], BaseUserAttributes[], ParsedQs>,
	res: Response<IUserAttributes[] | Record<string, unknown>>,
	next: NextFunction
) => {
	const { limit, loginSubstring } = req.query;
	try {
		if (limit && loginSubstring) {
			const result = await User.getAutoSuggestUsers(
				loginSubstring.toString().toLowerCase(),
				parseInt(limit.toString())
			);
			res.json(result);
		} else {
			res.status(401).send({ error: `Provide valid string value for "loginSubstring" and number for "limit"` });
		}
	} catch (e) {
		next(e);
		res.status(404).send({ error: e });
	}
};

export const createUser = async (
	{ body }: ValidatedRequest<BaseUserSchema>,
	res: Response<User | Record<string, unknown>>,
	next: NextFunction
) => {
	let user: User | undefined;
	try {
		user = await User.create({ login: body.login, password: body.password, age: body.age });
		res.json(user);
	} catch (e) {
		next(e);
		res.status(404).send({ error: e });
	}
};
