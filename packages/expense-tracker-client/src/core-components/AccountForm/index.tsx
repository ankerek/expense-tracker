import React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { GetCurrencyListQuery_getCurrencyList } from '@schema-types'
import { Field, Form, Formik, FormikProps, FormikErrors } from 'formik'
import Button from '@material-ui/core/Button'
import { TextField } from '../TextField'
import { ActionsWrapper } from './elements'
import { GetCurrencyList } from '@controllers/currency/GetCurrencyList'
import MenuItem from '@material-ui/core/MenuItem'

export interface AccountFormProps {
  initialValues?: AccountFormValues
  submit: (
    values: { input: AccountFormValues }
  ) => Promise<NormalizedErrorsMap | null>
}

export interface AccountFormValues {
  name: string
  currency: GetCurrencyListQuery_getCurrencyList
}

const initialEmptyValues = {
  name: '',
  currency: '',
}

const validate = (values: AccountFormValues) => {
  const errors: any = {}

  if (!values.name) {
    errors.name = 'Required'
  }
  if (!values.currency) {
    errors.currency = 'Required'
  }

  return errors
}

export class AccountForm<MutationVariables> extends React.PureComponent<
  AccountFormProps
> {
  handleSubmit = async (
    values: AccountFormValues,
    formikBag: FormikProps<AccountFormValues>
  ) => {
    const response = await this.props.submit({ input: values })

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<AccountFormValues>)
      formikBag.setSubmitting(false)
    }
  }

  render() {
    const { initialValues } = this.props
    return (
      <Formik
        initialValues={initialValues || initialEmptyValues}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={({
          isValid,
          setFieldValue,
        }: FormikProps<AccountFormValues>) => (
          <Form>
            <Field
              name="name"
              label="Name"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />
            <GetCurrencyList>
              {({ data }) => (
                <Field
                  name="currency"
                  label="Currency"
                  select
                  required
                  fullWidth
                  margin="normal"
                  component={TextField}
                  parseValue={(
                    currency: GetCurrencyListQuery_getCurrencyList
                  ) => currency.id}
                  onChange={(e: React.ChangeEvent<any>) =>
                    setFieldValue(
                      'currency',
                      data.getCurrencyList.find(
                        currency => currency.id === e.target.value
                      )
                    )
                  }
                >
                  {data &&
                    data.getCurrencyList &&
                    data.getCurrencyList.map(currency => (
                      <MenuItem key={currency.id} value={currency.id}>
                        {currency.id}
                      </MenuItem>
                    ))}
                </Field>
              )}
            </GetCurrencyList>
            <ActionsWrapper>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid}
              >
                Save account
              </Button>
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
