import express from 'express';
import { groupsRouter, usersRouter } from '../api';
import { config } from '../config';

export default ({ app }: { app: express.Application }) => {
	app.use(express.json());

	app.use(config.api.usersPrefix, usersRouter);
	app.use(config.api.groupsPrefix, groupsRouter);

	return app;
};
