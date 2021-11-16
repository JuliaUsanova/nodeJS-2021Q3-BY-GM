import { Client } from 'pg';
import { readFileSync } from 'fs';
import path from 'path';
import config from '../config';

const connectionConfig = {
	user: config.db.user,
	database: config.db.name,
	password: config.db.password,
	port: config.db.port,
	host: config.db.host
};
const client = new Client(connectionConfig);

const connect = async () => {
	const script = readFileSync(path.join(__dirname, './test-data.sql')).toString();

	try {
		await client.connect();
		const result = await client.query(script);
		console.log('user data generated successfully ', result);
		await client.end();
	} catch (e) {
		console.error('unable to generate users ', e);
	}
};

void connect();
