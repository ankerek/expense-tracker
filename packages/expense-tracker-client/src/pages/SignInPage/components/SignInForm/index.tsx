import React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { SignInMutationVariables } from '@schema-types'
import { Field, Formik, FormikProps, FormikErrors } from 'formik'
import Grid from '@material-ui/core/Grid'
import { Form } from '@components/Form'
import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { NavLink } from '@components/NavLink'
import { ActionsWrapper } from './elements'

export interface SignInFormProps {
  submit: (
    values: SignInMutationVariables
  ) => Promise<NormalizedErrorsMap | null>
  loading: boolean
}

export interface SignInFormValuesProps {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

const validate = (values: SignInFormValuesProps) => {
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

export class SignInForm extends React.PureComponent<SignInFormProps> {
  handleSubmit = async (
    values: SignInFormValuesProps,
    formikBag: FormikProps<SignInFormValuesProps>
  ) => {
    const response = await this.props.submit({ input: values })

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<
        SignInFormValuesProps
      >)
      formikBag.setSubmitting(false)
    }
  }

  render() {
    const { loading } = this.props

    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={(formikBag: FormikProps<SignInFormValuesProps>) => (
          <Form>
            <Field
              name="email"
              id="sign-in-form-email"
              label="E-mail"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />
            <Field
              name="password"
              id="sign-in-form-password"
              type="password"
              label="Password"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />
            <ActionsWrapper>
              <Grid container alignItems="center">
                <Grid item xs={4} sm={6}>
                  <NavLink to="/signup">Sign up instead</NavLink>
                </Grid>
                <Grid item xs={8} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!formikBag.isValid}
                    progress={loading}
                  >
                    Sign in
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
