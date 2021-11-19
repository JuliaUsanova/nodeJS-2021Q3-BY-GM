import express from 'express';
import expressLoader from './express.loader';
import errorMiddlewareLoader from './error-middleware.loader';
import sequelizeLoader from './sequelize.loader';

export async function startServer(PORT: number) {
	const app = express();

	await expressLoader({ app });
	await errorMiddlewareLoader({ app });
	await sequelizeLoader();

	app.listen(PORT, () => {
		console.log(`Running on port ${PORT}`);
	});
}
