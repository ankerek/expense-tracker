import * as React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { CreateAccountMutationVariables } from '@schema-types'
import { Field, Form, Formik, FormikProps, FormikErrors } from 'formik'
import Button from '@material-ui/core/Button'
import { TextField } from '@core-components/TextField'
import { ActionsWrapper } from './elements'
import { GetCurrencyList } from '@controllers/currency/GetCurrencyList'
import MenuItem from '@material-ui/core/MenuItem'

export interface SignInFormProps {
  submit: (
    values: CreateAccountMutationVariables
  ) => Promise<NormalizedErrorsMap | null>
}

export interface CreateAccountFormValues {
  name: string
  currency: string
}

const initialValues = {
  name: '',
  currency: '',
}

const validate = (values: CreateAccountFormValues) => {
  const errors: any = {}

  if (!values.name) {
    errors.name = 'Required'
  }
  if (!values.currency) {
    errors.currency = 'Required'
  }

  return errors
}

export class CreateAccountForm extends React.PureComponent<SignInFormProps> {
  handleSubmit = async (
    values: CreateAccountFormValues,
    formikBag: FormikProps<CreateAccountFormValues>
  ) => {
    const response = await this.props.submit({ input: values })

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<
        CreateAccountFormValues
      >)
      formikBag.setSubmitting(false)
    }
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={(formikBag: FormikProps<CreateAccountFormValues>) => (
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
                variant="raised"
                color="primary"
                disabled={!formikBag.isValid}
              >
                Create
              </Button>
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
