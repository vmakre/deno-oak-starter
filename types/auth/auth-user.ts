import type { UserRole as _UserRole } from "../user/user-role.ts";

/**
 * Authenticated user info
 * user as JWT access token payload
 */
export type AuthUser = {
  /** user id */
  id: number;
  /** user email address */
  email: string;
  /** user name */
  first_name: string;
  /** user last name */
  last_name: string;
  /** user roles */
  roles: string;
  /** active or not */
  is_active: boolean;
};
