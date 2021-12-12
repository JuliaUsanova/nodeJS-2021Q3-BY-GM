import { config } from '../config';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import dbDriver from '../services/db-driver.service';
import { Group } from '../models/group.model';

export const sequelize = new Sequelize({
	database: config.db.name,
	username: config.db.user,
	password: config.db.password,
	host: config.db.host,
	dialect: 'postgres',
	port: config.db.port,
	models: [User, Group]
});

export default async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection to DB has been established successfully.');
		dbDriver.setInstance(sequelize);
		await User.sync({ force: true });
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		return null;
	}
};
