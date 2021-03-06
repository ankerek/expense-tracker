import React from 'react'
import uuid from 'uuid/v4'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { SaveAccountInput } from '@schema-types'
import { DeleteAccount } from '@modules/account/DeleteAccount'
import { Field, Formik, FormikProps, FormikErrors } from 'formik'
import { Button } from '@components/Button'
import { Form } from '@components/Form'
import { TextField } from '../TextField'
import { ActionsWrapper } from './elements'

export interface AccountFormProps {
  initialValues?: AccountFormValues
  submit: (
    values: AccountFormValues,
    prevValues?: AccountFormValues
  ) => Promise<NormalizedErrorsMap | null>
  hasDelete?: boolean
  loading?: boolean
}

export type AccountFormValues = SaveAccountInput

const getInitialEmptyValues = () => ({
  id: uuid(),
  name: '',
  amount: 0,
})

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
    const response = await this.props.submit(values, this.props.initialValues)

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<AccountFormValues>)
      formikBag.setSubmitting(false)
    }
  }

  render() {
    const { initialValues, hasDelete, loading } = this.props
    return (
      <Formik
        initialValues={initialValues || getInitialEmptyValues()}
        validate={validate}
        onSubmit={this.handleSubmit}
        render={({ isValid }: FormikProps<AccountFormValues>) => (
          <Form>
            <Field
              name="name"
              id="account-form-name"
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
                      onClick={() => deleteAccount(initialValues)}
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
