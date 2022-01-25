import { Response, Router } from 'express';
import { GroupRequest as Request } from '../typings';
import { User } from '../models/user.model';
import * as fs from 'fs';

const jwt = require('jsonwebtoken');
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
		const secret = fs.readFileSync('./secret.txt');
		const token = jwt.sign(payload, secret, { expiresIn: 120 });

		return res.send(token);
	});
