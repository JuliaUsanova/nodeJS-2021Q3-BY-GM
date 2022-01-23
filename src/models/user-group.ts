import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Group } from './group.model';

@Table
export class UserGroup extends Model {
	@ForeignKey(() => User)
	@Column(DataType.STRING)
	userId!: string;

	@ForeignKey(() => Group)
	@Column(DataType.STRING)
	groupId!: string;
}
