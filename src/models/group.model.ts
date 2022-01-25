import { IGroup, IGroupBaseAttributes } from '../types/group';
import {
	AllowNull,
	BelongsToMany,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
	Unique,
	Validate
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { UserGroup } from './user-group';

// TODO: ADD DB VALIDATION FOR PERMISSIONS
export enum Permission {
	READ = 'READ',
	WRITE = 'WRITE',
	DELETE = 'DELETE',
	SHARE = 'SHARE',
	UPLOAD_FILES = 'UPLOAD_FILES'
}

@Table
export class Group extends Model<IGroup, IGroupBaseAttributes> {
	@PrimaryKey
	@Column(DataType.STRING)
	id = uuidv4();

	@AllowNull(false)
	@Unique(true)
	@Column(DataType.STRING)
	name!: string;

	@Validate({
		matchPermissions(value: Permission[]) {
			if (!value.every((item) => item in Permission)) {
				throw new Error(`Permissions should be a subset of ${Object.values(Permission)}`);
			}
		}
	})
	@AllowNull(false)
	@Column(DataType.ARRAY(DataType.STRING))
	permissions!: Permission[];

	@BelongsToMany(() => User, () => UserGroup)
	users!: Array<User & { UserGroup: UserGroup }>;

	updateDetails(name: string, permissions: Permission[]) {
		this.name = name ?? this.name;
		this.permissions = permissions && permissions.length ? permissions : this.permissions;
	}

	async getUsers() {
		return await this.$get('users');
	}
}
