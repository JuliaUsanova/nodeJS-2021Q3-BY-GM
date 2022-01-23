import { Application } from 'express';
import morgan from 'morgan';
import { GroupRequest, UserRequest } from '../typings';

morgan.token('params', (req: UserRequest | GroupRequest) => {
	return JSON.stringify({ params: req.params, query: req.query });
});
export default ({ app }: { app: Application }) => {
	app.use(morgan(':params :method :url'));
};
