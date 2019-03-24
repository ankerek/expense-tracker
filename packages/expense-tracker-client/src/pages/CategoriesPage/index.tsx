import React from 'react'
import { GetCategoryList } from '@controllers/category/GetCategoryList'
import { PageLayout } from '@core-components/PageLayout'
import { CategoryList } from '@pages/CategoriesPage/components/CategoryList'

export class CategoriesPage extends React.Component {
  render() {
    return (
      <PageLayout title="Categories">
        <GetCategoryList>
          {({ data }) =>
            data && data.getCategoryList ? (
              <CategoryList categories={data.getCategoryList} />
            ) : null
          }
        </GetCategoryList>
      </PageLayout>
    )
  }
}
