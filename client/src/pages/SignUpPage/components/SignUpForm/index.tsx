import * as React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { CreateUserMutationVariables } from '@schema-types'
import { Field, Form, Formik, FormikErrors, FormikProps } from 'formik'
import Button from '@material-ui/core/Button'
import { TextField } from '@core-components/TextField'
import { NavLink } from '@core-components/NavLink'
import Grid from '@material-ui/core/Grid'
import { ActionsContainer } from './elements'

export interface SignUpFormProps {
  submit: (
    values: CreateUserMutationVariables
  ) => Promise<NormalizedErrorsMap | null>
}

export interface SignUpFormValuesProps {
  email: string
  password: string
}

const initialValues = {
  email: '',
  password: '',
}

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
    return (
      <>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={this.handleSubmit}
          render={(formikBag: FormikProps<SignUpFormValuesProps>) => (
            <Form>
              <Field
                name="email"
                label="E-mail"
                required
                fullWidth
                margin="normal"
                component={TextField}
              />
              <Field
                name="password"
                type="password"
                label="Password"
                required
                fullWidth
                margin="normal"
                component={TextField}
              />
              <ActionsContainer>
                <Grid container alignItems='center'>
                  <Grid item xs={4} sm={6}>
                    <NavLink to="/signin">Sign in instead</NavLink>
                  </Grid>
                  <Grid item xs={8} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="raised"
                      color="primary"
                      disabled={!formikBag.isValid}
                    >
                      Sign up
                    </Button>
                  </Grid>
                </Grid>
              </ActionsContainer>
            </Form>
          )}
        />
      </>
    )
  }
}
