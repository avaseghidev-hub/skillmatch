import { axiosClient } from "../../../api/axiosClient";

/**
 * Login request payload.
 */
export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Register request payload.
 */
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

/**
 * Authentication response returned by backend after login/register.
 */
export type AuthResponse = {
  userId: number;
  name: string;
  email: string;
  token: string;
  message: string;
};

/**
 * Login user and receive JWT token.
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

/**
 * Register user and receive JWT token.
 */
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
};