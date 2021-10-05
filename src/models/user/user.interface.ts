import RoleType from "../role.type";

export interface IUser {
  id: number;
  email: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // FIXME: check role serialization
  role: { name: RoleType };
}

export interface IAdmin {
  user: IUser;
}