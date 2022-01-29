import { Router } from 'express';
import { checkToken } from './login';
import * as controller from '../controllers/group.controller';

// TODO: ADD REQUEST VALIDATION FOR PERMISSIONS

export const router = Router();

router.param('id', controller.getGroupById);

router
	.route('/:id')
	.get(checkToken, controller.readGroup)
	.put(checkToken, controller.updateGroup)
	.delete(checkToken, controller.deleteGroup);

router.route('/').post(checkToken, controller.createGroup).get(checkToken, controller.getAllGroups);
