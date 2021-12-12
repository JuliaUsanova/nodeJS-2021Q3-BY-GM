import { IGroup } from '../types/group';
import { Column, DataType, Model, PrimaryKey, Unique } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export class Group extends Model<IGroup> {
	@PrimaryKey
	@Column(DataType.STRING)
	id = uuidv4();

	@Unique(true)
	@Column(DataType.STRING)
	name!: string;

	@Column(DataType.ARRAY(DataType.STRING))
	permissions!: [];
}
