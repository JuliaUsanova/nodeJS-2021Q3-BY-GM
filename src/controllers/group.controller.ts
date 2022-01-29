import * as winston from 'winston';
import { transports } from 'winston';
import { GroupRequest as Request } from '../typings';
import { Group } from '../models/group.model';
import { NextFunction, Response } from 'express';
import { IGroup, IGroupBaseAttributes, IGroupLocals } from '../types/group';

const logger = winston.createLogger({
	transports: [new transports.Console()]
});

export const getGroupById = async (
	req: Request,
	res: Response<Record<string, string>>,
	next: NextFunction,
	id: string
) => {
	logger.info('Trying to fetch group by id ', id);
	try {
		const group = (await Group.findByPk(id)) ?? undefined;
		if (!group) {
			return res.status(404).json({ message: `Group with id ${id} is not found` });
		}
		req.group = group;
		next();
	} catch (e) {
		next(e);
	}
};

export const readGroup = async (
	{ group, params }: Request<{ id: string }, IGroup, {}, {}, IGroupLocals>,
	res: Response,
	next: NextFunction
) => {
	try {
		if (group) {
			const users = await group.getUsers();
			res.json({ group, users });
		} else {
			res.status(404).json({ message: `Group with id ${params.id} is not found` });
		}
	} catch (e) {
		next(e);
	}
};

export const updateGroup = async (
	{ group, body, params }: Request<{ id: string }, IGroup, IGroupBaseAttributes, {}, IGroupLocals>,
	res: Response<Group | Record<string, string>>,
	next: NextFunction
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
};

export const deleteGroup = async (
	{ group, params }: Request<{ id: string }, {}, {}, {}, IGroupLocals>,
	res: Response<number | Record<string, string>>,
	next: NextFunction
) => {
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
};

export const createGroup = async (
	{ body }: Request<{}, IGroup, IGroupBaseAttributes, {}, {}>,
	res: Response<IGroup | Record<string, any>>,
	next: NextFunction
) => {
	let group: Group | undefined;
	try {
		group = await new Group({ name: body.name, permissions: body.permissions });
		await group.save();

		res.json(group);
	} catch (e) {
		next(e);
		res.status(404).send({ error: e });
	}
};

export const getAllGroups = async (
	_req: Request<{}, IGroup[], {}, {}, {}>,
	res: Response<Group[] | Record<string, unknown>>,
	next: NextFunction
) => {
	let groups: Group[] | [];
	try {
		groups = await Group.findAll();

		res.json(groups);
	} catch (e) {
		next(e);
		res.status(404).send({ error: e });
	}
};
