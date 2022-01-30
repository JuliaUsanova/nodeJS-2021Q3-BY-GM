import { NextFunction, Response } from 'express';
import { GroupRequest as Request, GroupRequest } from '../typings';
import { getGroupById, readGroup, updateGroup } from './group.controller';
import { Group, Permission } from '../models/group.model';
import { IGroup, IGroupBaseAttributes, IGroupLocals } from '../types/group';
import { Model } from 'sequelize-typescript';

describe('GroupController', () => {
	beforeAll(() => {
		jest.mock('winston');
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	describe('getGroupById', () => {
		let mockRequest: GroupRequest;
		let mockResponse: Response;
		let mockNext: NextFunction;

		beforeEach(() => {
			mockRequest = {
				body: {},
				params: {},
				query: {}
			} as GroupRequest;

			mockResponse = {
				send: jest.fn().mockReturnValue({}),
				status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }),
				json: jest.fn().mockReturnValue({})
			} as unknown as Response;

			mockNext = jest.fn();
		});

		afterAll(() => {
			jest.resetAllMocks();
		});

		describe('group exists', () => {
			const group = {
				id: '12345',
				name: 'test group',
				permissions: ['WRITE'],
				save: jest.fn()
			} as unknown as Model<IGroup, IGroupBaseAttributes>;

			beforeAll(() => {
				jest.spyOn(Group, 'findByPk').mockResolvedValue(group);
			});

			afterAll(() => {
				jest.restoreAllMocks();
			});

			test('should get group by id from sequelize', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);
				expect(Group.findByPk).toBeCalledWith('12345');
			});

			test('should set local variable to group', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);
				expect(mockRequest.group).toBe(group);
			});

			test('should call next function', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);
				expect(mockNext).toBeCalled();
			});
		});

		describe('group does not exist', () => {
			beforeAll(() => {
				jest.spyOn(Group, 'findByPk').mockResolvedValue(null);
			});
			afterAll(() => {
				jest.restoreAllMocks();
			});

			test('should not set local variable', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);

				expect(mockRequest.group).toBe(undefined);
			});

			test('should send 404 error', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);

				expect(mockResponse.status).toBeCalledWith(404);
				expect(mockResponse.status(404).json).toBeCalledWith({ message: `Group with id ${id} is not found` });
			});

			test('should not call next function', async () => {
				const id = '12345';
				await getGroupById(mockRequest, mockResponse, mockNext, id);
				expect(mockNext).not.toBeCalled();
			});
		});
	});

	describe('readGroup', () => {
		let mockRequest: GroupRequest;
		let mockResponse: Response;
		let mockNext: NextFunction;

		const group = {
			id: '12345',
			name: 'test group',
			permissions: ['WRITE'],
			getUsers: jest.fn()
		} as unknown as Group;

		beforeEach(() => {
			mockRequest = {
				body: {},
				params: { id: '12345' },
				query: {},
				group
			} as GroupRequest<{ id: string }, IGroup, {}, {}, IGroupLocals>;

			mockResponse = {
				json: jest.fn().mockReturnValue({})
			} as unknown as Response;

			mockNext = jest.fn();

			jest.spyOn(group, 'getUsers').mockResolvedValue([]);
		});

		afterAll(() => {
			jest.resetAllMocks();
		});

		test('should read group and its users', async () => {
			// @ts-ignore
			await readGroup(mockRequest, mockResponse, mockNext);
			expect(mockResponse.json).toBeCalledWith({ group, users: [] });
		});
	});

	describe('updateGroup', () => {
		let mockRequest: GroupRequest;
		let mockResponse: Response;
		let mockNext: NextFunction;

		const group = {
			id: '12345',
			name: 'test group',
			permissions: ['WRITE'],
			save: jest.fn(),
			updateDetails: jest.fn()
		} as unknown as Group;

		beforeEach(() => {
			mockRequest = {
				body: { name: 'new name', permissions: ['READ'] },
				params: { id: '12345' },
				query: {},
				group
			} as Request<{ id: string }, IGroup, IGroupBaseAttributes, {}, IGroupLocals>;

			mockResponse = {
				status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) })
			} as unknown as Response;

			mockNext = jest.fn();

			jest.spyOn(group, 'save').mockImplementationOnce(() => Promise.resolve(group));
			jest.spyOn(group, 'updateDetails').mockImplementationOnce((name: string, permissions: Permission[]) => {
				Object.assign(group, { name, permissions });
			});
		});

		afterAll(() => {
			jest.resetAllMocks();
		});

		test('should trigger update and save changes', async () => {
			// @ts-ignore
			await updateGroup(mockRequest, mockResponse, mockNext);
			expect(group.updateDetails).toBeCalledWith(mockRequest.body.name, mockRequest.body.permissions);
			expect(group.save).toBeCalled();
		});

		test('should send 200 status', async () => {
			// @ts-ignore
			await updateGroup(mockRequest, mockResponse, mockNext);
			expect(mockResponse.status).toBeCalledWith(200);
			expect(mockResponse.status(200).json).toBeCalledWith(
				Object.assign(group, { name: 'new name', permissions: ['READ'] })
			);
		});
	});
});
