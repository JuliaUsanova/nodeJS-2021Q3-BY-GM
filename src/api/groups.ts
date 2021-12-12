import { Response, Router } from 'express';
import { GroupRequest as Request } from '../typings';
import { Group } from '../models/group.model';
import { IGroup, IGroupBaseAttributes } from '../types/group';

// TODO: ADD DB VALIDATION FOR PERMISSIONS

export const router = Router();
type IGroupLocals = Record<'group', IGroup>;

router.param('id', async (req: Request, _, next, id) => {
	console.log('>>>>>> entered group id param');
	req.group = (await Group.findByPk(id)) ?? undefined;

	next();
});

router
	.route('/:id')
	.get((req: Request<{ id: string }, IGroup, {}, {}, IGroupLocals>, res: Response) => {
		if (req.group) {
			res.json(req.group);
		} else {
			res.status(404).json({ message: `Group with id ${req.params.id} is not found` });
		}
	})
	.put(async (req: Request<{ id: string }, IGroup, IGroupBaseAttributes, {}, IGroupLocals>, res) => {
		if (req.group) {
			const group = req.group;
			const { name, permissions } = req.body;

			group.updateDetails(name, permissions);
			await group.save();

			res.status(200).json(group);
		} else {
			res.status(404).json({ message: `Group with id ${req.params.id} is not found` });
		}
	})
	.delete(async (req: Request<{ id: string }, {}, {}, {}, IGroupLocals>, res) => {
		if (req.group) {
			const group = req.group;

			await group.destroy();
			res.status(200).send();
		} else {
			res.status(404).json({ message: `Group with id ${req.params.id} is not found` });
		}
	});

router.post('/', async (req: Request<{}, IGroup, IGroupBaseAttributes, {}, {}>, res: Response<IGroup | string>) => {
	let group: Group | undefined;
	try {
		group = await new Group({ name: req.body.name, permissions: req.body.permissions });
		await group.save();

		res.json(group);
	} catch (e) {
		console.log(e);
		// @ts-ignore
		res.status(404).send({ error: e });
	}
});
