import { User } from '../models/user.model';
import { Response, Router } from 'express';
import { UserRequest as Request } from '../typings';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseUserAttributes, IUserAttributes } from '../types/user';
import { Op } from 'sequelize';
import { newUserValidator, userValidator } from '../validators';
import { baseUserBodySchema, BaseUserSchema } from '../validators/schemas';
import * as winston from 'winston';
import { transports } from 'winston';

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
			req: Request<{ id: string }, IUserAttributes, {}, {}, Record<string, BaseUserAttributes>>,
			res: Response,
			next
		) => {
			try {
				if (req.user) {
					res.json(req.user);
				} else {
					res.status(404).json({ message: `User with id ${req.params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	)
	.put(
		userValidator.body(baseUserBodySchema),
		async (
			req: Request<{ id: string }, IUserAttributes, BaseUserAttributes, {}, Record<string, BaseUserAttributes>>,
			res,
			next
		) => {
			try {
				if (req.user) {
					const user = req.user;
					const { login, password, age } = req.body;

					user.updateDetails(login, password, age);
					await user.save();

					res.status(200).json(user);
				} else {
					res.status(404).json({ message: `User with id ${req.params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	)
	.delete(async (req: Request<{ id: string }, {}, {}, {}, Record<string, BaseUserAttributes>>, res, next) => {
		try {
			if (req.user) {
				const user = req.user;

				await user.destroy();
				res.status(200).send();
			} else {
				res.status(404).json({ message: `User with id ${req.params.id} is not found` });
			}
		} catch (e) {
			next(e);
		}
	});

router.get(
	'/',
	async (
		req: Request<{}, IUserAttributes[], BaseUserAttributes[], { loginSubstring: string; limit: number }>,
		res: Response<IUserAttributes[]>,
		next
	) => {
		const { limit, loginSubstring } = req.query;
		try {
			const result = await getAutoSuggestUsers(loginSubstring.toLowerCase(), limit);
			res.json(result);
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
	async (req: ValidatedRequest<BaseUserSchema>, res: Response<User | string>, next) => {
		let user: User | undefined;
		try {
			user = await User.create({ login: req.body.login, password: req.body.password, age: req.body.age });
			res.json(user);
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	}
);

async function getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUserAttributes[]> {
	return await User.findAll({
		where: {
			login: {
				[Op.iLike]: `%${loginSubstring}%`
			}
		},
		order: [['login', 'DESC']],
		attributes: ['id', 'login', 'age', 'isDeleted'],
		limit
	});
}
