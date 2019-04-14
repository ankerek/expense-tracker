import React from 'react'
import { PageLayout } from '@components/PageLayout'
import { SaveCategory } from '@modules/category/SaveCategory'
import { CategoryForm } from '@components/CategoryForm'

export default class CreateCategoryPage extends React.Component {
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
