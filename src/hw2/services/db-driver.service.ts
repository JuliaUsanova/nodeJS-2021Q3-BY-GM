import { Sequelize } from 'sequelize';

export class DbDriver {
	private driver: Sequelize;
	constructor() {
		this.driver = {} as Sequelize;
	}

	setInstance(driver: Sequelize) {
		this.driver = driver;
	}
	async close() {
		await this.driver.close();
		console.log('connection to DB driver was terminated');
	}
}

const dbDriver = new DbDriver();
export default dbDriver;
