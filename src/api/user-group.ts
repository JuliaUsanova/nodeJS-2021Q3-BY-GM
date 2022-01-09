import { GroupRequest as Request } from '../typings';
import { Response, Router } from 'express';
import { IGroup } from '../types/group';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';

export const router = Router();

router.param('id', async (req: Request, _, next, id) => {
	console.log('>>>>>> entered group id param ', id);
	req.group = (await Group.findByPk(id)) ?? undefined;

	req.group ? next() : next(`The group with id ${req.params.id} is not found`);
});

router.post('/:id', async (req: Request<{}, string, {}, { userIds: string[] }, {}>, res: Response<IGroup | string>) => {
	const { userIds } = req.query;
	try {
		await addUsersToGroup(req.group!, userIds);
		res.status(200);
	} catch (e) {
		// @ts-ignore
		res.status(404).send({ error: e });
	}
});

async function addUsersToGroup(group: Group, userIds: string[]) {
	const users = await User.findAll({
		where: {
			id: userIds
		}
	});
	await group.$add('users', users);
	for (let i = 0; i < users.length; i++) {
		await users[i].$add('groups', group);
	}
	return true;
}
