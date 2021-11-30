import { User } from '../models/user.model';
import { Response, Router } from 'express';
import { Request } from '../typings';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseUserAttributes, UserAttributes } from '../types/user';
import { Op } from 'sequelize';
import { newUserValidator, userValidator } from '../validators';
import { baseUserBodySchema, BaseUserSchema } from '../validators/schemas';

export const router = Router();

router.param('id', async (req: Request, _, next, id) => {
	console.log('>>>>>> entered param');
	req.user = (await User.findByPk(id)) ?? undefined;

	next();
});

router
	.route('/:id')
	.get((req: Request<{ id: string }, UserAttributes, {}, {}, Record<string, BaseUserAttributes>>, res: Response) => {
		if (req.user) {
			res.json(req.user);
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	})
	.put(
		userValidator.body(baseUserBodySchema),
		async (
			req: Request<{ id: string }, UserAttributes, BaseUserAttributes, {}, Record<string, BaseUserAttributes>>,
			res
		) => {
			if (req.user) {
				const user = req.user;
				const { login, password, age } = req.body;

				user.updateDetails(login, password, age);
				await user.save();

				res.status(200).json(user);
			} else {
				res.status(404).json({ message: `User with id ${req.params.id} is not found` });
			}
		}
	)
	.delete(async (req: Request<{ id: string }, {}, {}, {}, Record<string, BaseUserAttributes>>, res) => {
		if (req.user) {
			const user = req.user;

			// TODO: DO WE NEED TO ONLY MARK USER FOR DELETION?
			await user.destroy();

			res.status(200).send();
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	});

router.get(
	'/',
	async (
		req: Request<{}, UserAttributes[], BaseUserAttributes[], { loginSubstring: string; limit: number }>,
		res: Response<UserAttributes[]>
	) => {
		const { limit, loginSubstring } = req.query;
		res.json(await getAutoSuggestUsers(loginSubstring, limit));
	}
);

router.post('/', newUserValidator, async (req: ValidatedRequest<BaseUserSchema>, res: Response<User | string>) => {
	let user: User | undefined;
	try {
		user = await User.create({ login: req.body.login, password: req.body.password, age: req.body.age });

		res.json(user);
	} catch (e) {
		console.log(e);
		// @ts-ignore
		res.status(404).send({ error: e });
	}
});

async function getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<UserAttributes[]> {
	return await User.findAll({
		where: {
			login: {
				[Op.substring]: loginSubstring
			}
		},
		order: ['login', 'DESC'],
		limit
	});
}
