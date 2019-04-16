import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { GetCategoryListQuery_getCategoryList } from '@schema-types'
import { OutsideActionsWrapper } from './elements'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { Button } from '@components/Button'
import { NavLink } from '@components/NavLink'
import { EmptyState } from '@components/EmptyState'
import { List } from '@components/List'

interface CategoryListProps {
  categories: GetCategoryListQuery_getCategoryList[]
  subscribe?: () => void
}

class C extends React.PureComponent<CategoryListProps & RouteComponentProps> {
  componentDidMount() {
    if (this.props.subscribe) {
      this.props.subscribe()
    }
  }

  render() {
    const { categories, history } = this.props
    return (
      <>
        <List>
          {categories.length ? (
            categories.map(category => (
              <List.Item
                key={category.id}
                gray={!category.isPersisted}
                onClick={() =>
                  history.push({
                    pathname: `/categories/${category.id}`,
                    state: { next: '/categories' },
                  })
                }
              >
                <List.ItemRow>
                  {category.name}
                  {!category.isPersisted && (
                    <ItemNotPersistedIndicator compact={true} />
                  )}
                </List.ItemRow>
              </List.Item>
            ))
          ) : (
            <EmptyState title="There are no categories" />
          )}
        </List>
        <OutsideActionsWrapper>
          <Button.Link
            to={{
              pathname: '/categories/create',
              state: { next: '/categories' },
            }}
            variant="contained"
            color="primary"
          >
            Create new category
          </Button.Link>
        </OutsideActionsWrapper>
      </>
    )
  }
}

export const CategoryList = withRouter(C)
