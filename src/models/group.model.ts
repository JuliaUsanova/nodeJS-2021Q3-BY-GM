import { IGroup, IGroupBaseAttributes, Permission } from '../types/group';
import { BelongsToMany, Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { UserGroup } from './user-group';

@Table
export class Group extends Model<IGroup, IGroupBaseAttributes> {
	@PrimaryKey
	@Column(DataType.STRING)
	id = uuidv4();

	@Unique(true)
	@Column(DataType.STRING)
	name!: string;

	@Column(DataType.ARRAY(DataType.STRING))
	permissions!: Permission[];

	@BelongsToMany(() => User, () => UserGroup)
	users!: Array<User & { UserGroup: UserGroup }>;

	updateDetails(name: string, permissions: Permission[]) {
		this.name = name ?? this.name;
		this.permissions = permissions && permissions.length ? permissions : this.permissions;
	}
}
