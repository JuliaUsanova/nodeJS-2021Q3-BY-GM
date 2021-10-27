import { router } from './router';

import express from 'express';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());

app.use((req, _, next) => {
	console.log('!!!!!', req.body);
	next();
});

app.use('/users', router);

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
