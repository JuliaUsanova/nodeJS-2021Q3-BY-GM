import { User } from './hw2/user.model';

declare module 'express' {
	interface Request {
		user: User;
	}
	interface Response {
		user: User;
	}
}
