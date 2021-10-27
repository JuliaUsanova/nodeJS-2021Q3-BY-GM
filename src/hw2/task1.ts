import { router } from './router';

import express, { Response, Request } from 'express';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());

// used for debugging purpose
app.use((req, _, next) => {
	console.log('!!!!! req.body ', req.body);
	console.log('!!!!! req.query ', req.query);
	next();
});

app.use('/users', router);

app.use((err: Error, _: Request, res: Response) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
