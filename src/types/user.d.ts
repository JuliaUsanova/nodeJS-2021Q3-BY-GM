export type BaseUserAttributes = {
	login: string;
	password: string;
	age: number;
};

export interface IUserAttributes {
	id: string;
	login: string;
	password: string;
	age: number;
	isDeleted: boolean;
}
