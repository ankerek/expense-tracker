/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountListQuery
// ====================================================

export interface GetAccountListQuery_getAccountList_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface GetAccountListQuery_getAccountList {
  __typename: 'Account'
  id: string
  name: string
  currency: GetAccountListQuery_getAccountList_currency
}

export interface GetAccountListQuery {
  getAccountList: GetAccountListQuery_getAccountList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccountMutation
// ====================================================

export interface CreateAccountMutation_createAccount_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface CreateAccountMutation_createAccount {
  __typename: 'Account'
  id: string
  name: string
  currency: CreateAccountMutation_createAccount_currency
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

export interface GetAccountQuery_getAccount_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface GetAccountQuery_getAccount {
  __typename: 'Account'
  id: string
  name: string
  currency: GetAccountQuery_getAccount_currency
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

export interface UpdateAccountMutation_updateAccount_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface UpdateAccountMutation_updateAccount {
  __typename: 'Account'
  id: string
  name: string
  currency: UpdateAccountMutation_updateAccount_currency
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
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface GetCurrencyListQuery {
  getCurrencyList: GetCurrencyListQuery_getCurrencyList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTransactionMutation
// ====================================================

export interface CreateTransactionMutation_createTransaction_account_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface CreateTransactionMutation_createTransaction_account {
  __typename: 'Account'
  id: string
  name: string
  currency: CreateTransactionMutation_createTransaction_account_currency
}

export interface CreateTransactionMutation_createTransaction {
  __typename: 'Transaction'
  id: string
  description: string | null
  amount: number
  account: CreateTransactionMutation_createTransaction_account
}

export interface CreateTransactionMutation {
  createTransaction: CreateTransactionMutation_createTransaction
}

export interface CreateTransactionMutationVariables {
  input: SaveTransactionInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTransactionListQuery
// ====================================================

export interface GetTransactionListQuery_getTransactionList_account_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface GetTransactionListQuery_getTransactionList_account {
  __typename: 'Account'
  id: string
  name: string
  currency: GetTransactionListQuery_getTransactionList_account_currency
}

export interface GetTransactionListQuery_getTransactionList {
  __typename: 'Transaction'
  id: string
  description: string | null
  amount: number
  account: GetTransactionListQuery_getTransactionList_account
}

export interface GetTransactionListQuery {
  getTransactionList: GetTransactionListQuery_getTransactionList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserQuery
// ====================================================

export interface GetCurrentUserQuery_getCurrentUser {
  __typename: 'User'
  id: string
  email: string
}

export interface GetCurrentUserQuery {
  getCurrentUser: GetCurrentUserQuery_getCurrentUser | null
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user {
  __typename: 'User'
  id: string
  email: string
}

export interface SignInMutation_signIn {
  __typename: 'SignInResponse'
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
  __typename: 'User'
  id: string
  email: string
}

export interface CreateUserMutation_createUser {
  __typename: 'SignInResponse'
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

export interface account_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface account {
  __typename: 'Account'
  id: string
  name: string
  currency: account_currency
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: currency
// ====================================================

export interface currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: transaction
// ====================================================

export interface transaction_account_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface transaction_account {
  __typename: 'Account'
  id: string
  name: string
  currency: transaction_account_currency
}

export interface transaction {
  __typename: 'Transaction'
  id: string
  description: string | null
  amount: number
  account: transaction_account
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: user
// ====================================================

export interface user {
  __typename: 'User'
  id: string
  email: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface SaveAccountInput {
  id?: string | null
  name: string
  currency: SaveCurrencyInput
}

export interface SaveCurrencyInput {
  id: string
  symbol: string
}

export interface SaveTransactionInput {
  id: string
  createdAt: string
  description?: string | null
  amount: number
  account: SaveAccountInput
}

export interface UserCreateInput {
  email: string
  password: string
}

//==============================================================
// END Enums and Input Objects
//==============================================================
