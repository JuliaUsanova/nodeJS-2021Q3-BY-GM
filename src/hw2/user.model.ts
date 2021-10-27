export class User {
	id: string;
	login: string;
	password: string;
	age: number;
	isDeleted = false;

	constructor(id: string, login: string, password: string, age: number) {
		this.id = id;
		this.login = login;
		this.password = password;
		this.age = age;
	}

	updateDetails(login: string, password: string, age: number) {
		this.login = login || this.login;
		this.password = password || this.password;
		this.age = age || this.age;
	}

	markForDeletion() {
		this.isDeleted = true;
	}
}
