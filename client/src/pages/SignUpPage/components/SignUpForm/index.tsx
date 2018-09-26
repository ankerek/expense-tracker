import * as React from 'react'
import { CreateUserMutationFn } from '@pages/SignUpPage/controllers/CreateUserMutation'
import { GraphQLError } from 'graphql'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import { TextField } from '@core-components/TextField'
import { ButtonContainer } from './elements'

export interface SignUpFormProps {
  createUser: CreateUserMutationFn
}

export interface SignUpFormState {
  errors: string[]
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

export class SignUpForm extends React.PureComponent<
  SignUpFormProps,
  SignUpFormState
> {
  constructor(props: any) {
    super(props)
    this.state = { errors: [] }
  }

  handleSubmit = async (values: SignUpFormValuesProps) => {
    try {
      const response = await this.props.createUser({
        variables: { input: values },
      })
      console.log(response)
    } catch (res) {
      const errors = res.graphQLErrors.map(
        (error: GraphQLError) => error.message
      )
      this.setState({ errors })
    }
  }

  discardErrors = () => {
    this.setState({ errors: [] })
  }

  render() {
    const { createUser } = this.props

    return (
      <>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={this.handleSubmit}
          render={(formikBag: FormikProps<SignUpFormValuesProps>) => (
            <Form>{console.log(formikBag)}
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
              <ButtonContainer>
                <Button
                  type="submit"
                  fullWidth
                  variant="raised"
                  color="primary"
                  disabled={!formikBag.isValid}
                >
                  Sign up
                </Button>
              </ButtonContainer>
            </Form>
          )}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.errors.length > 0}
          onClose={this.discardErrors}
          message={
            <div>
              {this.state.errors.map((errorMessage, index) => (
                <div key={index}>{errorMessage}</div>
              ))}
            </div>
          }
          action={
            <IconButton
              key="close"
              color="inherit"
              onClick={this.discardErrors}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </>
    )
  }
}
