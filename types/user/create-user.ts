/** Request body to create user */
export type CreateUser = {
  /** user first name */
  first_name: string;
  /** user last name */
  last_name: string;
  /** user email */
  email: string;
  /** user password */
  password: string;
  /** roles */
};
