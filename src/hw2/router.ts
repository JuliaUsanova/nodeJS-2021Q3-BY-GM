import { BaseUser, User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { users } from './data';
import { Router, Response } from 'express';
import { Request } from '../typings';
import { ValidatedRequest } from 'express-joi-validation';
import { baseUserBodySchema, BaseUserSchema, validator } from './validators';
export const router = Router();

router.param('id', (req: Request, _, next, id) => {
	req.user = users.find((u) => u.id === id);
	next();
});

router
	.route('/:id')
	.get((req: Request<{ id: string }, User, {}, {}, Record<string, BaseUser>>, res: Response) => {
		if (req.user) {
			res.json(req.user);
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	})
	.put(
		validator.body(baseUserBodySchema),
		(req: Request<{ id: string }, User, BaseUser, {}, Record<string, BaseUser>>, res) => {
			if (req.user) {
				const user = req.user;
				const { login, password, age } = req.body;
				user.updateDetails(login, password, age);
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: `User with id ${req.params.id} is not found` });
			}
		}
	)
	.delete((req: Request<{ id: string }, {}, {}, {}, Record<string, BaseUser>>, res) => {
		if (req.user) {
			const user = req.user;
			user.markForDeletion();
			res.status(200).send();
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	});

router.get(
	'/',
	(req: Request<{}, User[], BaseUser[], { loginSubstring: string; limit: number }>, res: Response<User[]>) => {
		const { limit, loginSubstring } = req.query;
		res.json(getAutoSuggestUsers(loginSubstring, limit));
	}
);

router.post('/', validator.body(baseUserBodySchema), (req: ValidatedRequest<BaseUserSchema>, res: Response<User>) => {
	const user = new User(uuidv4(), req.body.login, req.body.password, req.body.age);

	users.push(user);
	res.json(user);
});

function getAutoSuggestUsers(loginSubstring: string, limit: number) {
	return users
		.filter((u) => u.login.includes(loginSubstring))
		.slice(0, limit)
		.sort((u1, u2) => {
			if (u1.login < u2.login) {
				return 1;
			}
			return -1;
		});
}
