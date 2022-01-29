import { config } from '../config';

import { closeServer, startServer } from '../loaders';
import { eventEmitter } from '../services/event-emitter';
import dbDriver from '../services/db-driver.service';

void startServer(config.port);

eventEmitter.once('close', async () => {
	closeServer();
	await dbDriver.close();
});
