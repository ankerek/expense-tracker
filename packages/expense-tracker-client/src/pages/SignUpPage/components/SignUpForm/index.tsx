import React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { CreateUserMutationVariables, Currency } from '@schema-types'
import { Field, Formik, FormikErrors, FormikProps } from 'formik'
import { Button } from '@components/Button'
import { Form } from '@components/Form'
import { TextField } from '@components/TextField'
import { NavLink } from '@components/NavLink'
import Grid from '@material-ui/core/Grid'
import { ActionsWrapper } from './elements'
import MenuItem from '@material-ui/core/MenuItem'

export interface SignUpFormProps {
  currencies: Currency[]
  submit: (
    values: CreateUserMutationVariables
  ) => Promise<NormalizedErrorsMap | null>
  loading: boolean
}

export interface SignUpFormValuesProps {
  email: string
  password: string
  currency: Currency
}

const getInitialValues = (currencies: Currency[]) => ({
  email: '',
  password: '',
  currency: currencies[0],
})

const validate = (values: SignUpFormValuesProps) => {
  const errors: any = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  }

  return errors
}

export class SignUpForm extends React.PureComponent<SignUpFormProps> {
  handleSubmit = async (
    values: SignUpFormValuesProps,
    formikBag: FormikProps<SignUpFormValuesProps>
  ) => {
    const response = await this.props.submit({ input: values })

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<
        SignUpFormValuesProps
      >)
      formikBag.setSubmitting(false)
    }
  }

  render() {
    const { currencies, loading } = this.props
    return (
      <Formik
        initialValues={getInitialValues(currencies)}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={({
          isValid,
          setFieldValue,
        }: FormikProps<SignUpFormValuesProps>) => (
          <Form>
            <Field
              name="email"
              id="sign-up-form-email"
              label="E-mail"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />
            <Field
              name="password"
              id="sign-up-form-password"
              type="password"
              label="Password"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />

            <Field
              name="currency"
              id="sign-up-form-currency"
              label="Currency"
              select
              required
              fullWidth
              margin="normal"
              component={TextField}
              parseValue={(currency: Currency) => currency.id}
              onChange={(e: React.ChangeEvent<any>) =>
                setFieldValue(
                  'currency',
                  currencies.find(currency => currency.id === e.target.value)
                )
              }
            >
              {currencies.map(currency => (
                <MenuItem key={currency.id} value={currency.id}>
                  {currency.id}
                </MenuItem>
              ))}
            </Field>
            <ActionsWrapper>
              <Grid container alignItems="center">
                <Grid item xs={4} sm={6}>
                  <NavLink to="/signin">Sign in instead</NavLink>
                </Grid>
                <Grid item xs={8} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    progress={loading}
                  >
                    Sign up
                  </Button>
                </Grid>
              </Grid>
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
