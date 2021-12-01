import { Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserAttributes } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isDeleted'> {}

@Table
export class User extends Model<User, UserCreationAttributes> {
	@PrimaryKey
	@Column(DataType.STRING)
	id = uuidv4();

	@Unique(true)
	@Column(DataType.STRING)
	login!: string;

	@Column(DataType.STRING)
	password!: string;

	@Column(DataType.INTEGER)
	age!: number;

	@Column(DataType.BOOLEAN)
	isDeleted = false;

	updateDetails(login: string, password: string, age: number) {
		console.log(login, password, age);
		this.login = login ?? this.login;
		this.password = password ?? this.password;
		this.age = age ?? this.age;
	}

	markForDeletion() {
		this.isDeleted = true;
	}
}
