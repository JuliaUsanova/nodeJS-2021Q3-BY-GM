import { Table, Column, Model, DataType, AllowNull, Unique, PrimaryKey } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserAttributes } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isDeleted'> {}

@Table
export class User extends Model<User, UserCreationAttributes> {
	@Column(DataType.UUIDV4)
	@AllowNull(false)
	@PrimaryKey
	id = uuidv4();

	@Column(DataType.STRING)
	@Unique(true)
	login = '';

	@Column(DataType.STRING)
	password = '';

	@Column(DataType.INTEGER)
	age = 0;

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
