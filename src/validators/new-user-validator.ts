import { Request } from '../typings';
import { NextFunction, Response } from 'express';
import { asyncUserBodySchema } from './schemas';
import { User } from '../models/user.model';

export default (req: Request, _res: Response<User | undefined>, next: NextFunction) => {
	return asyncUserBodySchema
		.validateAsync(req.body)
		.then(() => next())
		.catch((e) => next(e));
};
