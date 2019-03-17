/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountListQuery
// ====================================================

export interface GetAccountListQuery_getAccountList {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface GetAccountListQuery {
  getAccountList: GetAccountListQuery_getAccountList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccountMutation
// ====================================================

export interface CreateAccountMutation_createAccount {
  __typename: 'Account'
  id: string
  name: string
  amount: number
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
// GraphQL mutation operation: DeleteAccountMutation
// ====================================================

export interface DeleteAccountMutation {
  deleteAccount: boolean
}

export interface DeleteAccountMutationVariables {
  id: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountQuery
// ====================================================

export interface GetAccountQuery_getAccount {
  __typename: 'Account'
  id: string
  name: string
  amount: number
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
  __typename: 'Account'
  id: string
  name: string
  amount: number
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
// GraphQL query operation: GetIsOnlineQuery
// ====================================================

export interface GetIsOnlineQuery {
  isOnline: boolean
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTransactionMutation
// ====================================================

export interface CreateTransactionMutation_createTransaction_account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface CreateTransactionMutation_createTransaction {
  __typename: 'Transaction'
  id: string
  createdAt: string
  description: string | null
  amount: number
  account: CreateTransactionMutation_createTransaction_account
  isPersisted: boolean
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
// GraphQL mutation operation: DeleteTransactionMutation
// ====================================================

export interface DeleteTransactionMutation {
  deleteTransaction: boolean
}

export interface DeleteTransactionMutationVariables {
  id: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTransactionQuery
// ====================================================

export interface GetTransactionQuery_getTransaction_account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface GetTransactionQuery_getTransaction {
  __typename: 'Transaction'
  id: string
  createdAt: string
  description: string | null
  amount: number
  account: GetTransactionQuery_getTransaction_account
  isPersisted: boolean
}

export interface GetTransactionQuery {
  getTransaction: GetTransactionQuery_getTransaction
}

export interface GetTransactionQueryVariables {
  id: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTransactionListQuery
// ====================================================

export interface GetTransactionListQuery_getTransactionList_account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface GetTransactionListQuery_getTransactionList {
  __typename: 'Transaction'
  id: string
  createdAt: string
  description: string | null
  amount: number
  account: GetTransactionListQuery_getTransactionList_account
  isPersisted: boolean
}

export interface GetTransactionListQuery {
  getTransactionList: GetTransactionListQuery_getTransactionList[]
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTransactionMutation
// ====================================================

export interface UpdateTransactionMutation_updateTransaction_account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface UpdateTransactionMutation_updateTransaction {
  __typename: 'Transaction'
  id: string
  createdAt: string
  description: string | null
  amount: number
  account: UpdateTransactionMutation_updateTransaction_account
  isPersisted: boolean
}

export interface UpdateTransactionMutation {
  updateTransaction: UpdateTransactionMutation_updateTransaction
}

export interface UpdateTransactionMutationVariables {
  id: string
  input: SaveTransactionInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUserQuery
// ====================================================

export interface GetCurrentUserQuery_getCurrentUser_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface GetCurrentUserQuery_getCurrentUser {
  __typename: 'User'
  id: string
  email: string
  currency: GetCurrentUserQuery_getCurrentUser_currency
}

export interface GetCurrentUserQuery {
  getCurrentUser: GetCurrentUserQuery_getCurrentUser | null
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignInMutation
// ====================================================

export interface SignInMutation_signIn_user_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface SignInMutation_signIn_user {
  __typename: 'User'
  id: string
  email: string
  currency: SignInMutation_signIn_user_currency
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
  input: SignInInput
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUserMutation
// ====================================================

export interface CreateUserMutation_createUser_user_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface CreateUserMutation_createUser_user {
  __typename: 'User'
  id: string
  email: string
  currency: CreateUserMutation_createUser_user_currency
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
// GraphQL fragment: Account
// ====================================================

export interface Account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Currency
// ====================================================

export interface Currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Transaction
// ====================================================

export interface Transaction_account {
  __typename: 'Account'
  id: string
  name: string
  amount: number
}

export interface Transaction {
  __typename: 'Transaction'
  id: string
  createdAt: string
  description: string | null
  amount: number
  account: Transaction_account
  isPersisted: boolean
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: User
// ====================================================

export interface User_currency {
  __typename: 'Currency'
  id: string
  symbol: string
}

export interface User {
  __typename: 'User'
  id: string
  email: string
  currency: User_currency
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface SaveAccountInput {
  id: string
  name: string
  amount?: number | null
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

export interface SignInInput {
  email: string
  password: string
}

export interface UserCreateInput {
  email: string
  password: string
  currency: SaveCurrencyInput
}

//==============================================================
// END Enums and Input Objects
//==============================================================
