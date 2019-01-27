import React from 'react'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { DeleteAccount } from '@controllers/account/DeleteAccount'
import { Field, Formik, FormikProps, FormikErrors } from 'formik'
import { Button } from '@core-components/Button'
import { Form } from '@core-components/Form'
import { TextField } from '../TextField'
import { ActionsWrapper } from './elements'

export interface AccountFormProps {
  initialValues?: AccountFormValues
  submit: (
    values: { input: AccountFormValues }
  ) => Promise<NormalizedErrorsMap | null>
  hasDelete?: boolean
  loading?: boolean
}

export interface AccountFormValues {
  name: string
}

const initialEmptyValues = {
  name: '',
}

const validate = (values: AccountFormValues) => {
  const errors: any = {}

  if (!values.name) {
    errors.name = 'Required'
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
    const { initialValues, hasDelete, loading } = this.props
    return (
      <Formik
        initialValues={initialValues || initialEmptyValues}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={({ isValid }: FormikProps<AccountFormValues>) => (
          <Form>
            <Field
              name="name"
              label="Name"
              required
              fullWidth
              margin="normal"
              component={TextField}
            />
            <ActionsWrapper>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid}
                progress={loading}
              >
                Save account
              </Button>
              {hasDelete && (
                <DeleteAccount>
                  {(deleteAccount, { loading: deleteLoading }) => (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={deleteAccount as any}
                      progress={deleteLoading}
                    >
                      Delete account
                    </Button>
                  )}
                </DeleteAccount>
              )}
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
