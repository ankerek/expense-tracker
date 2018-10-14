/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccountMutation
// ====================================================

export interface CreateAccountMutation_createAccount {
  id: string
  name: string
  currency: string
}

export interface CreateAccountMutation {
  createAccount: CreateAccountMutation_createAccount
}

export interface CreateAccountMutationVariables {
  input: SaveAccountInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountQuery
// ====================================================

export interface GetAccountQuery_getAccount {
  id: string
  name: string
  currency: string
}

export interface GetAccountQuery {
  getAccount: GetAccountQuery_getAccount
}

export interface GetAccountQueryVariables {
  id: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAccountMutation
// ====================================================

export interface UpdateAccountMutation_updateAccount {
  id: string
  name: string
  currency: string
}

export interface UpdateAccountMutation {
  updateAccount: UpdateAccountMutation_updateAccount
}

export interface UpdateAccountMutationVariables {
  id: string
  input: SaveAccountInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrencyListQuery
// ====================================================

export interface GetCurrencyListQuery_getCurrencyList {
  id: string
}

export interface GetCurrencyListQuery {
  getCurrencyList: GetCurrencyListQuery_getCurrencyList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserQuery
// ====================================================

export interface GetCurrentUserQuery_getCurrentUser {
  id: string
  email: string
}

export interface GetCurrentUserQuery {
  getCurrentUser: GetCurrentUserQuery_getCurrentUser | null
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountListQuery
// ====================================================

export interface GetAccountListQuery_getAccountList {
  id: string
  name: string
  currency: string
}

export interface GetAccountListQuery {
  getAccountList: GetAccountListQuery_getAccountList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user {
  id: string
  email: string
}

export interface SignInMutation_signIn {
  token: string
  user: SignInMutation_signIn_user
}

export interface SignInMutation {
  signIn: SignInMutation_signIn
}

export interface SignInMutationVariables {
  input: UserCreateInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUserMutation
// ====================================================

export interface CreateUserMutation_createUser_user {
  id: string
  email: string
}

export interface CreateUserMutation_createUser {
  token: string
  user: CreateUserMutation_createUser_user
}

export interface CreateUserMutation {
  createUser: CreateUserMutation_createUser
}

export interface CreateUserMutationVariables {
  input: UserCreateInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: account
// ====================================================

export interface account {
  id: string
  name: string
  currency: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: user
// ====================================================

export interface user {
  id: string
  email: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface SaveAccountInput {
  name: string
  currency: string
}

export interface UserCreateInput {
  email: string
  password: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
