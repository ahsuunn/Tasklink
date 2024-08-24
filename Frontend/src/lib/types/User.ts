export interface IUser {
  _id: string;
  email: string;
  password: string;
  displayName: string;
  role?: "student" | "admin";
}

export interface IUserForm {
  email?: string;
  password?: string;
  displayName?: string;
  role?: "student" | "admin";
}
