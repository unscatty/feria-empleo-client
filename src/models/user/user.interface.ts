import RoleType from "../role.type";

export interface IUser {
  id: number;
  email: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  role: RoleType;
}

export interface IAdmin {
  user: IUser;
}