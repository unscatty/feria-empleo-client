export interface IUser {
  id: number;
  email: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  // role: Role;
}
