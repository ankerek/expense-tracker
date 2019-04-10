import React from 'react'
import { SaveCategory } from '@modules/category/SaveCategory'
import { GetCategory } from '@modules/category/GetCategory'
import { PageLayout } from '@components/PageLayout'
import { CategoryForm } from '@components/CategoryForm'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'

export class CategoryPage extends React.Component {
  render() {
    return (
      <PageLayout title="Category" hasGoBack>
        <GetCategory>
          {({ data }) => {
            const account = data && data.getCategory
            return account ? (
              <>
                {!account.isPersisted && <ItemNotPersistedIndicator />}
                <SaveCategory>
                  {(submit, { loading }) => (
                    <CategoryForm
                      initialValues={data.getCategory}
                      submit={submit}
                      hasDelete
                      loading={loading}
                    />
                  )}
                </SaveCategory>
              </>
            ) : null
          }}
        </GetCategory>
      </PageLayout>
    )
  }
}
