import { GroupRequest as Request } from '../typings';
import { Response, Router } from 'express';
import { IGroup } from '../types/group';
import { Group } from '../models/group.model';
import * as winston from 'winston';
import { transports } from 'winston';
import { UserGroup } from '../models/user-group';
import { checkToken } from './login';

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
	checkToken,
	async (req: Request<{}, string, {}, { userIds: string[] }, {}>, res: Response<IGroup | string>, next) => {
		const { userIds } = req.query;
		try {
			await UserGroup.addUsersToGroup(req.group!, userIds);
			res.status(200).send();
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	}
);
