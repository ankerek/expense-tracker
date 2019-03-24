import React from 'react'
import { GetCategoryListQuery_getCategoryList } from '@schema-types'
import { Amount, Container, Item, OutsideActionsWrapper } from './elements'
import Divider from '@material-ui/core/Divider'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Button } from '@core-components/Button'
import { NavLink } from '@core-components/NavLink'

interface CategoryListProps {
  categories: GetCategoryListQuery_getCategoryList[]
}

export class CategoryList extends React.PureComponent<CategoryListProps> {
  render() {
    const { categories } = this.props
    return (
      <>
        <Container>
          {categories.map(category => (
            <div key={category.id}>
              <Item isNotPersisted={!category.isPersisted}>
                <NavLink
                  to={{
                    pathname: `/categories/${category.id}`,
                    state: { next: '/categories' },
                  }}
                >
                  {category.name}
                </NavLink>
                {!category.isPersisted && (
                  <ItemNotPersistedIndicator compact={true} />
                )}
                <Amount>
                  <FormattedAmount>{category.amount}</FormattedAmount>
                </Amount>
              </Item>
              <Divider light />
            </div>
          ))}
        </Container>
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

// TODO: create and use FormattedAmount component
