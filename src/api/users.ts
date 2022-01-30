import { Router } from 'express';
import { newUserValidator, userValidator } from '../validators';
import { baseUserBodySchema } from '../validators/schemas';
import { checkToken } from './login';
import * as controller from '../controllers/user.controller';

export const router = Router();

router.param('id', controller.getUserById);

router
	.route('/:id')
	.get(controller.readUser)
	.put(userValidator.body(baseUserBodySchema), controller.updateUser)
	.delete(controller.deleteUser);

router.get('/', checkToken, controller.getAutoSuggestedUsers);

router.post('/', newUserValidator, controller.createUser);
