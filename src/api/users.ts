import { User } from '../models/user.model';
import { Response, Router } from 'express';
import { UserRequest as Request } from '../typings';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseUserAttributes, IUserAttributes } from '../types/user';
import { newUserValidator, userValidator } from '../validators';
import { baseUserBodySchema, BaseUserSchema } from '../validators/schemas';
import * as winston from 'winston';
import { transports } from 'winston';
import { checkToken } from './login';
import { ParsedQs } from 'qs';

export const router = Router();

const logger = winston.createLogger({
	transports: [new transports.Console()]
});

router.param('id', async (req: Request, _, next, id) => {
	logger.info('Trying to fetch user by id ', id);

	try {
		req.user = (await User.findByPk(id)) ?? undefined;
		next();
	} catch (e) {
		next(e);
	}
});

router
	.route('/:id')
	.get(
		(
			{ user, params }: Request<{ id: string }, IUserAttributes, {}, {}, Record<string, BaseUserAttributes>>,
			res: Response,
			next
		) => {
			try {
				if (user) {
					res.json(user);
				} else {
					res.status(404).json({ message: `User with id ${params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	)
	.put(
		userValidator.body(baseUserBodySchema),
		async (
			{
				user,
				body,
				params
			}: Request<{ id: string }, IUserAttributes, BaseUserAttributes, {}, Record<string, BaseUserAttributes>>,
			res,
			next
		) => {
			try {
				if (user) {
					const { login, password, age } = body;

					user.updateDetails(login, password, age);
					await user.save();

					res.status(200).json(user);
				} else {
					res.status(404).json({ message: `User with id ${params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	)
	.delete(
		async (
			{ user, params }: Request<{ id: string }, {}, {}, {}, Record<string, BaseUserAttributes>>,
			res,
			next
		) => {
			try {
				if (user) {
					await user.destroy();
					res.status(200).send();
				} else {
					res.status(404).json({ message: `User with id ${params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	);

router.get(
	'/',
	checkToken,
	async (
		req: Request<{}, IUserAttributes[], BaseUserAttributes[], ParsedQs>,
		res: Response<IUserAttributes[] | string>,
		next
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
				res.status(401).send(`Provide valid string value for "loginSubstring" and number for "limit"`);
			}
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	}
);

router.post(
	'/',
	newUserValidator,
	async ({ body }: ValidatedRequest<BaseUserSchema>, res: Response<User | string>, next) => {
		let user: User | undefined;
		try {
			user = await User.create({ login: body.login, password: body.password, age: body.age });
			res.json(user);
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	}
);
