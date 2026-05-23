import { apiFetch } from "./client";
import type {
  LoginRequest,
  LoginResult,
  SignupBloggerRequest,
  SignupBusinessRequest,
  SignupResult,
  UserMe,
} from "./types";

const AUTH_PATHS = {
  login: "/api/v1/auth/login",
  signup: "/api/v1/auth/signup",
  me: "/api/v1/users/me",
} as const;

export async function login(request: LoginRequest): Promise<LoginResult> {
  return apiFetch<LoginResult>(AUTH_PATHS.login, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function signupBusiness(
  request: SignupBusinessRequest,
): Promise<SignupResult> {
  return apiFetch<SignupResult>(AUTH_PATHS.signup, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function signupBlogger(
  request: SignupBloggerRequest,
): Promise<SignupResult> {
  return apiFetch<SignupResult>(AUTH_PATHS.signup, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getMe(token: string): Promise<UserMe> {
  return apiFetch<UserMe>(AUTH_PATHS.me, {
    method: "GET",
    token,
  });
}
