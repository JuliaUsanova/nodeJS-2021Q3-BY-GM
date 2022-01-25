import cors from 'cors';
import express from 'express';
import { groupsRouter, userGroupRouter, usersRouter, loginRouter } from '../api';
import { config } from '../config';

export default ({ app }: { app: express.Application }) => {
	app.use(express.json());
	app.use(cors());

	app.use(config.api.usersPrefix, usersRouter);
	app.use(config.api.groupsPrefix, groupsRouter);
	app.use(config.api.groupsPrefix, userGroupRouter);
	app.use(config.api.loginPrefix, loginRouter);

	return app;
};
