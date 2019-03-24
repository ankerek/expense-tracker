import React from 'react'
import uuid from 'uuid/v4'
import { NormalizedErrorsMap } from '@utils/normalizeErrors'
import { SaveCategoryInput } from '@schema-types'
import { DeleteCategory } from '@controllers/category/DeleteCategory'
import { Field, Formik, FormikProps, FormikErrors } from 'formik'
import { Button } from '@core-components/Button'
import { Form } from '@core-components/Form'
import { TextField } from '../TextField'
import { ActionsWrapper } from './elements'

export interface CategoryFormProps {
  initialValues?: CategoryFormValues
  submit: (
    values: CategoryFormValues,
    prevValues?: CategoryFormValues
  ) => Promise<NormalizedErrorsMap | null>
  hasDelete?: boolean
  loading?: boolean
}

export type CategoryFormValues = SaveCategoryInput

const getInitialEmptyValues = () => ({
  id: uuid(),
  name: '',
  amount: 0,
})

const validate = (values: CategoryFormValues) => {
  const errors: any = {}

  if (!values.name) {
    errors.name = 'Required'
  }

  return errors
}

export class CategoryForm<MutationVariables> extends React.PureComponent<
  CategoryFormProps
> {
  handleSubmit = async (
    values: CategoryFormValues,
    formikBag: FormikProps<CategoryFormValues>
  ) => {
    const response = await this.props.submit(values, this.props.initialValues)

    if (response && response.errors) {
      formikBag.setErrors(response.errors as FormikErrors<CategoryFormValues>)
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
        render={({ isValid }: FormikProps<CategoryFormValues>) => (
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
                Save category
              </Button>
              {hasDelete && (
                <DeleteCategory>
                  {(deleteCategory, { loading: deleteLoading }) => (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => deleteCategory(initialValues)}
                      progress={deleteLoading}
                    >
                      Delete category
                    </Button>
                  )}
                </DeleteCategory>
              )}
            </ActionsWrapper>
          </Form>
        )}
      />
    )
  }
}
