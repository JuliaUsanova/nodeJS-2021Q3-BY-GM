import { GroupRequest as Request } from '../typings';
import { NextFunction, Response } from 'express';
import { IGroup } from '../types/group';
import { UserGroup } from '../models/user-group';

export const addUsersToTheGroup = async (
	req: Request<{}, string, {}, { userIds: string[] }, {}>,
	res: Response<IGroup | Record<string, unknown>>,
	next: NextFunction
) => {
	const { userIds } = req.query;
	try {
		await UserGroup.addUsersToGroup(req.group!, userIds);
		res.status(200).send();
	} catch (e) {
		next(e);
		res.status(404).send({ error: e });
	}
};
