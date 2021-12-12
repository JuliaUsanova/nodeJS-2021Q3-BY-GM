import { BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { IUserAttributes } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import { Group } from './group.model';
import { UserGroup } from './user-group';

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'isDeleted'> {}

@Table
export class User extends Model<User, IUserCreationAttributes> {
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

	@BelongsToMany(() => Group, () => UserGroup)
	groups!: Array<Group & { UserGroup: UserGroup }>;

	updateDetails(login: string, password: string, age: number) {
		this.login = login ?? this.login;
		this.password = password ?? this.password;
		this.age = age ?? this.age;
	}
}
