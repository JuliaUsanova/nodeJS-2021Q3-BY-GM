import express from 'express';
import { groupsRouter, userGroupRouter, usersRouter } from '../api';
import { config } from '../config';

export default ({ app }: { app: express.Application }) => {
	app.use(express.json());

	app.use(config.api.usersPrefix, usersRouter);
	app.use(config.api.groupsPrefix, groupsRouter);
	app.use(config.api.groupsPrefix, userGroupRouter);

	return app;
};
