import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Group } from './group.model';

@Table
export class UserGroup extends Model {
	static async addUsersToGroup(group: Group, userIds: string[]) {
		const users = await User.findAll({
			where: {
				id: userIds
			}
		});
		await group.$add('user', users);
		for (let i = 0; i < users.length; i++) {
			await users[i].$add('group', group);
		}
	}

	@ForeignKey(() => User)
	@Column(DataType.STRING)
	userId!: string;

	@ForeignKey(() => Group)
	@Column(DataType.STRING)
	groupId!: string;
}
