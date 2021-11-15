import { Client } from 'pg';
import { readFileSync } from 'fs';
import path from 'path';

const connectionConfig = {
	user: 'postgres',
	database: 'postgres',
	password: 'password',
	port: 5432,
	host: 'localhost'
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
