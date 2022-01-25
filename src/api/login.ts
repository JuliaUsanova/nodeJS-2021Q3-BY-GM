import { NextFunction, Response, Router } from 'express';
import { GroupRequest, GroupRequest as Request, UserRequest } from '../typings';
import { User } from '../models/user.model';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

export const router = Router();

router
	.route('/')
	.post(async (req: Request<{}, string, { username: string; password: string }, {}, {}>, res: Response<string>) => {
		const { username, password } = req.body;
		const user = await User.findOne({
			where: {
				login: username,
				password: password
			}
		});
		if (!user || user.isDeleted) {
			return res.status(401).send('Bad username/password combination');
		}

		const payload = { sub: user.id };
		const secret = fs.readFileSync('./secret.txt').toString();
		const token = jwt.sign(payload, secret, { expiresIn: 120 });

		return res.send(token);
	});

export function checkToken(req: GroupRequest | UserRequest, res: Response, next: NextFunction) {
	const token = req.headers['x-access-token'];
	if (!token) {
		return res.status(401).send('No token provided');
	}
	if (typeof token === 'string') {
		const secret = fs.readFileSync('./secret.txt').toString();
		return jwt.verify(token, secret, (err, _decoded) => {
			if (err) {
				return res.status(403).send('Failed to authenticate token');
			}

			return next();
		});
	}
}
