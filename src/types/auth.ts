
export interface LoginRequest {
  email: string;
  password: string;
}

//new
export type RegisterRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};
// export interface RegisterRequest {
//   fullName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export type UserBusiness = {
  id: string;
  businessKey: string;
  businessName: string;
  roleName: string;
  isDefault: boolean;
};

export type RegisterResponse = {
  token?: string;
  email?: string;
  role?: string;
  message?: string;
};

//new
export type LoginResponse = {
  token: string;
  email?: string;
  role?: string;
};

//export type LoginResponse = {
//   token: string;
//   user: {
//     id: string;
//     email: string;
//   };
//   businesses: UserBusiness[];
//   currentBusinessId: string | null;
// };