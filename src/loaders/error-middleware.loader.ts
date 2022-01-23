import { Application, NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import dbDriver from '../services/db-driver.service';
import * as winston from 'winston';

const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});

export default ({ app }: { app: Application }) => {
	app.use(
		(err: Error | ExpressJoiError, _req: Request, res: Response, next: NextFunction) => {
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
		async (err: Error, req: Request, res: Response) => {
			logger.error('Unhandled error ', req.path, err.stack);
			await dbDriver.close();
			res.status(500).json('Internal Server Error');
		}
	);

	process
		.on('unhandledRejection', (reason, promise) => {
			winston.error('Unhandled Rejection at Promise', reason, promise);
		})
		.on('uncaughtException', (err) => {
			winston.error('Uncaught Exception thrown', err);
			process.exit(1);
		});

	return app;
};
