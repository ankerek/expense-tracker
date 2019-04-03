import React from 'react'
import uuid from 'uuid/v4'
import format from 'date-fns/format'
import {
  GetAccountListQuery_getAccountList,
  GetCategoryListQuery_getCategoryList,
  SaveTransactionInput,
} from '@schema-types'
import { Field, Formik, FormikProps } from 'formik'
import { DATE_FORMAT } from '@utils/date'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'
import { DeleteTransaction } from '@modules/transaction/DeleteTransaction'
import { Button } from '@core-components/Button'
import { Form } from '@core-components/Form'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { TextField } from '../TextField'
import { DatePickerField } from '@core-components/DatePickerField'
import { ActionsWrapper } from './elements'

type TransactionFormValues = SaveTransactionInput

export interface TransactionFormProps {
  accounts: GetAccountListQuery_getAccountList[]
  categories: GetCategoryListQuery_getCategoryList[]
  initialValues?: TransactionFormValues
  submit: (
    values: TransactionFormValues,
    prevValues?: TransactionFormValues
  ) => void
  hasDelete?: boolean
  loading?: boolean
}

const getEmptyInitialValues = (
  accounts: GetAccountListQuery_getAccountList[],
  categories: GetCategoryListQuery_getCategoryList[]
) => ({
  id: uuid(),
  createdAt: format(new Date(), DATE_FORMAT),
  description: '',
  amount: 0,
  account: accounts[0],
  category: categories[0],
})

const validate = (values: SaveTransactionInput) => {
  const errors: any = {}

  if (!values.createdAt) {
    errors.createdAt = 'Required'
  }
  if (!values.amount) {
    errors.amount = 'Required'
  }
  if (!values.category) {
    errors.category = 'Required'
  }
  if (!values.account) {
    errors.account = 'Required'
  }

  return errors
}

export class TransactionForm<MutationVariables> extends React.PureComponent<
  TransactionFormProps
> {
  handleSubmit = async (values: TransactionFormValues) => {
    this.props.submit(values, this.props.initialValues)
  }

  render() {
    const {
      initialValues,
      accounts,
      categories,
      hasDelete,
      loading,
    } = this.props
    return (
      <Formik
        initialValues={
          initialValues || getEmptyInitialValues(accounts, categories)
        }
        validate={validate}
        onSubmit={this.handleSubmit}
        render={({
          isValid,
          setFieldValue,
        }: FormikProps<TransactionFormValues>) => (
          <Form>
            <Field
              name="createdAt"
              label="Created"
              required
              fullWidth
              margin="normal"
              component={DatePickerField}
            />
            <Field
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              component={TextField}
            />
            <Field
              name="amount"
              label="Amount"
              type="number"
              required
              fullWidth
              margin="normal"
              component={TextField}
              InputProps={{
                startAdornment: (
                  <GetCurrentUser>
                    {({ data }) =>
                      data.getCurrentUser ? (
                        <InputAdornment position="start">
                          {data.getCurrentUser.currency.symbol}
                        </InputAdornment>
                      ) : null
                    }
                  </GetCurrentUser>
                ),
              }}
            />

            <Field
              name="account"
              label="Account"
              select
              required
              fullWidth
              margin="normal"
              component={TextField}
              parseValue={(account: GetAccountListQuery_getAccountList) =>
                account.id
              }
              onChange={(e: React.ChangeEvent<any>) =>
                setFieldValue(
                  'account',
                  accounts.find(account => account.id === e.target.value)
                )
              }
            >
              {accounts.map(account => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Field>

            <Field
              name="category"
              label="Category"
              select
              required
              fullWidth
              margin="normal"
              component={TextField}
              parseValue={(category: GetCategoryListQuery_getCategoryList) =>
                category.id
              }
              onChange={(e: React.ChangeEvent<any>) =>
                setFieldValue(
                  'category',
                  categories.find(category => category.id === e.target.value)
                )
              }
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Field>

            <ActionsWrapper>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid}
                progress={loading}
              >
                Save transaction
              </Button>
              {hasDelete && (
                <DeleteTransaction>
                  {(deleteTransaction, { loading: deleteLoading }) => (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteTransaction(initialValues)}
                      progress={deleteLoading}
                    >
                      Delete transaction
                    </Button>
                  )}
                </DeleteTransaction>
              )}
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
