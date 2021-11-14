import RoleType from '../role.type';

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  email: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  role: RoleType;
}

export interface IAdmin {
  user: IUser;
}
