import { Response, Router } from 'express';
import { GroupRequest as Request } from '../typings';
import { Group } from '../models/group.model';
import { IGroup, IGroupBaseAttributes } from '../types/group';
import * as winston from 'winston';
import { transports } from 'winston';

// TODO: ADD REQUEST VALIDATION FOR PERMISSIONS

export const router = Router();
type IGroupLocals = Record<'group', IGroup>;

const logger = winston.createLogger({
	transports: [new transports.Console()]
});

router.param('id', async (req: Request, _, next, id) => {
	logger.info('Trying to fetch group by id ', id);
	try {
		req.group = (await Group.findByPk(id)) ?? undefined;
		next();
	} catch (e) {
		next(e);
	}
});

router
	.route('/:id')
	.get(async ({ group, params }: Request<{ id: string }, IGroup, {}, {}, IGroupLocals>, res: Response, next) => {
		try {
			if (group) {
				const users = await group.$get('users');
				res.json({ group, users });
			} else {
				res.status(404).json({ message: `Group with id ${params.id} is not found` });
			}
		} catch (e) {
			next(e);
		}
	})
	.put(
		async (
			{ group, body, params }: Request<{ id: string }, IGroup, IGroupBaseAttributes, {}, IGroupLocals>,
			res,
			next
		) => {
			try {
				if (group) {
					const { name, permissions } = body;

					group.updateDetails(name, permissions);
					await group.save();

					res.status(200).json(group);
				} else {
					res.status(404).json({ message: `Group with id ${params.id} is not found` });
				}
			} catch (e) {
				next(e);
			}
		}
	)
	.delete(async ({ group, params }: Request<{ id: string }, {}, {}, {}, IGroupLocals>, res, next) => {
		try {
			if (group) {
				await group.destroy();
				res.status(200).send();
			} else {
				res.status(404).json({ message: `Group with id ${params.id} is not found` });
			}
		} catch (e) {
			next(e);
		}
	});

router
	.route('/')
	.post(async ({ body }: Request<{}, IGroup, IGroupBaseAttributes, {}, {}>, res: Response<IGroup | string>, next) => {
		let group: Group | undefined;
		try {
			group = await new Group({ name: body.name, permissions: body.permissions });
			await group.save();

			res.json(group);
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	})
	.get(async (_req: Request<{}, IGroup[], {}, {}, {}>, res: Response, next) => {
		let groups: Group[] | [];
		try {
			groups = await Group.findAll();

			res.json(groups);
		} catch (e) {
			next(e);
			// @ts-ignore
			res.status(404).send({ error: e });
		}
	});
