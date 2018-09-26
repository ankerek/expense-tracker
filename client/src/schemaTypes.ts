/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserListQueryProps
// ====================================================

export interface UserListQueryProps_users {
  id: string;
  email: string;
}

export interface UserListQueryProps {
  users: UserListQueryProps_users[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUserMutation
// ====================================================

export interface CreateUserMutation_createUser {
  id: string;
}

export interface CreateUserMutation {
  createUser: CreateUserMutation_createUser;
}

export interface CreateUserMutationVariables {
  input: UserCreateInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface UserCreateInput {
  email: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
