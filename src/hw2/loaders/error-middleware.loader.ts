import express, { NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';

export default async ({ app }: { app: express.Application }) => {
	app.use(
		(err: Error | ExpressJoiError, _: Request, res: Response, next: NextFunction) => {
			console.log(err);
			if ('type' in err && err.error?.isJoi) {
				res.status(400).json({
					type: err.type,
					message: err.error?.toString() || 'Something went wrong!'
				});
			} else {
				// pass on to another error handler
				next(err);
			}
		},
		(err: Error, _: Request, res: Response) => {
			console.error(err.stack);
			res.status(500).send('Something went wrong!');
		}
	);

	return app;
};
