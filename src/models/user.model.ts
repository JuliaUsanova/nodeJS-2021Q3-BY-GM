import { AllowNull, BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Op, Optional } from 'sequelize';
import { IUserAttributes } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import { Group } from './group.model';
import { UserGroup } from './user-group';

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'isDeleted'> {}

@Table
export class User extends Model<User, IUserCreationAttributes> {
	static async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUserAttributes[]> {
		return await User.findAll({
			where: {
				login: {
					[Op.iLike]: `%${loginSubstring}%`
				}
			},
			order: [['login', 'DESC']],
			attributes: ['id', 'login', 'age', 'isDeleted'],
			limit
		});
	}

	@PrimaryKey
	@Column(DataType.STRING)
	id = uuidv4();

	@AllowNull(false)
	@Unique(true)
	@Column(DataType.STRING)
	login!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	get password(): string {
		return this.getDataValue('password');
	}
	set password(value) {
		// TODO: encrypt
		this.setDataValue('password', value);
	}

	@AllowNull(false)
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
