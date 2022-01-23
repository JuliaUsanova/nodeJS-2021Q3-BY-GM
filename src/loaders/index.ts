import express from 'express';
import expressRouterLoader from './express-router.loader';
import errorMiddlewareLoader from './error-middleware.loader';
import loggerMiddlewareLoader from './logger-middleware.loader';
import sequelizeLoader from './sequelize.loader';

export async function startServer(PORT: number) {
	const app = express();

	loggerMiddlewareLoader({ app });
	expressRouterLoader({ app });
	errorMiddlewareLoader({ app });
	await sequelizeLoader();

	app.listen(PORT, () => {
		console.log(`Running on port ${PORT}`);
	});
}
