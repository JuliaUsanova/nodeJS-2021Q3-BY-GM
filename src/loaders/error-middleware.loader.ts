import { Application, NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import * as winston from 'winston';
import { transports } from 'winston';
import { eventEmitter } from '../services/event-emitter';

const logger = winston.createLogger({
	transports: [new transports.Console()],
	exceptionHandlers: [new transports.File({ filename: 'exceptions.log' })],
	// @ts-ignore
	rejectionHandlers: [new transports.File({ filename: 'rejections.log' })]
});

export default ({ app }: { app: Application }) => {
	app.use(
		(err: Error | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
			if ('type' in err && err.error?.isJoi) {
				logger.error('User error ', req.path, req.params, err);
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
			logger.error('Unhandled error ', req.path, req.params, err.stack);
			res.status(500).json('Internal Server Error');

			eventEmitter.emit('close');
		}
	);

	return app;
};
