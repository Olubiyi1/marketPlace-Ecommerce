export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  phoneNumber: string;
};

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  phoneNumber?: string;
};

export type UserLoginData={
    email : string;
    password: string
}