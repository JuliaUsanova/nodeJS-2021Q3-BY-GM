import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { users } from './data';
import { Router, Request, Response } from 'express';

export const router = Router();

interface UserRequest extends Request {
	user?: User;
}

router.param('id', (req: UserRequest, _, next, id) => {
	req.user = users.find((u) => u.id === id);
	next();
});

router
	.route('/:id')
	.get((req: UserRequest, res: Response) => {
		if (req.user) {
			res.json(req.user);
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	})
	.put((req: UserRequest, res) => {
		if (req.user) {
			const user = req.user;
			const { login, password, age } = req.params;
			user.updateDetails(login, password, parseInt(age));
			res.status(200).send();
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	})
	.delete((req: UserRequest, res) => {
		if (req.user) {
			const user = req.user;
			user.markForDeletion();
			res.status(200).send();
		} else {
			res.status(404).json({ message: `User with id ${req.params.id} is not found` });
		}
	});

router.get(
	'/auto-suggest',
	(req: Request<{}, User[], User[], { loginSubstring: string; limit: number }>, res: Response<User[]>) => {
		const { limit, loginSubstring } = req.query;

		res.json(getAutoSuggestUsers(loginSubstring, limit));
	}
);

router.post('/', (req: Request<{}, User, User>, res: Response<User>) => {
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
