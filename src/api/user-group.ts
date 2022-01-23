import { GroupRequest as Request } from '../typings';
import { Response, Router } from 'express';
import { IGroup } from '../types/group';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import * as winston from 'winston';
import { transports } from 'winston';

export const router = Router();

const logger = winston.createLogger({
	transports: [new transports.Console()]
});

router.param('id', async (req: Request, _, next, id) => {
	logger.info('Trying to fetch group by id ', id);
	try {
		req.group = (await Group.findByPk(id)) ?? undefined;
		req.group ? next() : next(`The group with id ${req.params.id} is not found`);
	} catch (e) {
		next(e);
	}
});

router.post(
	'/:id',
	async (req: Request<{}, string, {}, { userIds: string[] }, {}>, res: Response<IGroup | string>, next) => {
		const { userIds } = req.query;
		try {
			await addUsersToGroup(req.group!, userIds);
			res.status(200).send();
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	}
);

async function addUsersToGroup(group: Group, userIds: string[]) {
	const users = await User.findAll({
		where: {
			id: userIds
		}
	});
	await group.$add('user', users);
	for (let i = 0; i < users.length; i++) {
		await users[i].$add('group', group);
	}
}
