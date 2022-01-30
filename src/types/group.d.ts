import { Permission } from '../models/group.model';

export interface IGroup {
	id: string;
	name: string;
	permissions: Array<Permission>;
}

export type IGroupBaseAttributes = Omit<IGroup, 'id'>;

export type IGroupLocals = Record<'group', IGroup>;
