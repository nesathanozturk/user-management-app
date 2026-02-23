export interface BulkUploadError {
  field: string;
  message: string;
  row: number;
}

export interface BulkUploadResponse {
  count?: number;
  errors?: BulkUploadError[];
  message?: string;
  success: boolean;
}

export interface CreateUserRequest {
  age: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface JWTPayload {
  email: string;
  role: string;
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: string;
  };
}

export interface PaginationInfo {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface User {
  age: number;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: string;
  updatedAt: string;
}

export interface UserQueryParams {
  limit?: number;
  maxAge?: number;
  minAge?: number;
  page?: number;
}

export interface UsersResponse {
  pagination: PaginationInfo;
  users: User[];
}
