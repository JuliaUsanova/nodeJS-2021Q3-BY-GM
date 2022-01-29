import { Router } from 'express';
import { checkToken } from './login';
import * as controller from '../controllers/user-group.controller';
import { getGroupById } from '../controllers/group.controller';

export const router = Router();

router.param('id', getGroupById);

router.post('/:id', checkToken, controller.addUsersToTheGroup);
