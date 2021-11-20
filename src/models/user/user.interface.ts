import RoleType from '../role.type';

export interface IUser {
  id: number;
  name: string;
  lastname: string;
  email: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  role: RoleType;
}

export interface IAdmin {
  user: IUser;
}

export type UserUpdateFields = Partial<Pick<IUser, 'name' | 'lastname'>>;
