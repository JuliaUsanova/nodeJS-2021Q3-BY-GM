import newUserValidator from './new-user-validator';
import * as userSchemas from './schemas';
import { createValidator } from 'express-joi-validation';

const userValidator = createValidator({ passError: true });
export { newUserValidator, userSchemas, userValidator };
