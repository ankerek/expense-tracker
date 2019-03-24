import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { SaveCategory } from '@controllers/category/SaveCategory'
import { CategoryForm } from '@core-components/CategoryForm'

export class CreateCategoryPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new category" hasGoBack>
        <SaveCategory>
          {(submit, { loading }) => (
            <CategoryForm submit={submit} loading={loading} />
          )}
        </SaveCategory>
      </PageLayout>
    )
  }
}
