import React from 'react'
import uuid from 'uuid/v4'
import format from 'date-fns/format'
import {
  GetAccountListQuery_getAccountList,
  SaveTransactionInput,
} from '@schema-types'
import { Field, Form, Formik, FormikProps } from 'formik'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '../TextField'
import { DATE_FORMAT, DatePickerField } from '@core-components/DatePickerField'
import { ActionsWrapper } from './elements'

type TransactionFormValues = SaveTransactionInput

export interface TransactionFormProps {
  accounts: GetAccountListQuery_getAccountList[]
  initialValues?: Partial<TransactionFormValues>
  submit: (values: TransactionFormValues) => void
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
    const { initialValues, accounts } = this.props
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
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
