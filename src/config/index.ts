import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
	// This error should crash whole process
	throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export const config = {
	port: process.env.PORT ? parseInt(process.env.PORT) : 3030,
	db: {
		user: process.env['DB_USER'],
		password: process.env['DB_PSW'],
		host: process.env['DB_HOST'],
		name: process.env['DB_NAME'],
		port: process.env['DB_PORT'] as unknown as number
	},

	/**
	 * API configs
	 */
	api: {
		usersPrefix: '/users',
		groupsPrefix: '/groups'
	}
};
