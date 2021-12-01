import express from 'express';
import { usersRouter } from '../api';
import { config } from '../config';

export default ({ app }: { app: express.Application }) => {
	app.use(express.json());

	app.use(config.api.prefix, usersRouter);

	return app;
};
