import React from 'react'
import uuid from 'uuid/v4'
import format from 'date-fns/format'
import {
  GetAccountListQuery_getAccountList,
  SaveTransactionInput,
} from '@schema-types'
import { Field, Formik, FormikProps } from 'formik'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import { DeleteTransaction } from '@controllers/transaction/DeleteTransaction'
import { Button } from '@core-components/Button'
import { Form } from '@core-components/Form'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { TextField } from '../TextField'
import { DATE_FORMAT, DatePickerField } from '@core-components/DatePickerField'
import { ActionsWrapper } from './elements'

type TransactionFormValues = SaveTransactionInput

export interface TransactionFormProps {
  accounts: GetAccountListQuery_getAccountList[]
  initialValues?: Partial<TransactionFormValues>
  submit: (values: TransactionFormValues) => void
  hasDelete?: boolean
}

const getEmptyInitialValues = (
  accounts: GetAccountListQuery_getAccountList[]
) => ({
  id: uuid(),
  createdAt: format(new Date(), DATE_FORMAT),
  description: '',
  amount: 0,
  account: accounts[0],
})

const validate = (values: SaveTransactionInput) => {
  const errors: any = {}

  if (!values.createdAt) {
    errors.createdAt = 'Required'
  }
  if (!values.amount) {
    errors.amount = 'Required'
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
    this.props.submit(values)
  }

  render() {
    const { initialValues, accounts, hasDelete } = this.props
    return (
      <Formik
        initialValues={initialValues || getEmptyInitialValues(accounts)}
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

            <ActionsWrapper>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid}
              >
                Save transaction
              </Button>
              {hasDelete && (
                <DeleteTransaction>
                  {({ deleteTransaction }) => (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={deleteTransaction}
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
