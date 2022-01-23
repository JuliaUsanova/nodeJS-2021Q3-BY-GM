import { Application, NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import dbDriver from '../services/db-driver.service';

export default ({ app }: { app: Application }) => {
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
		async (err: Error, _: Request, res: Response) => {
			console.error(err.stack);
			await dbDriver.close();
			res.status(500).send('Something went wrong!');
		}
	);

	return app;
};
