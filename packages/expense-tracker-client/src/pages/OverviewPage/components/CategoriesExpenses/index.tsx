import React from 'react'
import values from 'lodash/values'
import { Category, Transaction } from '@schema-types'
import { sum } from '@utils/math'
import { sortByAmount } from '@utils/sortByAmount'
import { List } from '@core-components/List'
import { Box } from '@core-components/Box'
import { FormattedAmount } from '@core-components/FormattedAmount'
import { Typography } from '@material-ui/core'
import { Chart } from './Chart'
import { ChartWrapper } from './elements'

interface CategoriesExpensesProps {
  transactions: Transaction[]
}

interface CategoryWithAmount extends Category {
  amount: number
}

export class CategoriesExpenses extends React.Component<
  CategoriesExpensesProps
> {
  render() {
    const { transactions } = this.props

    const categoriesById = transactions.reduce(
      (acc, curr) => {
        if (acc[curr.category.id]) {
          acc[curr.category.id].amount = sum(
            acc[curr.category.id].amount,
            curr.amount
          )
        } else {
          acc[curr.category.id] = { ...curr.category, amount: curr.amount }
        }

        return acc
      },
      {} as {
        [categoryId: string]: CategoryWithAmount
      }
    )

    const categories = values(categoriesById).sort(sortByAmount('asc'))

    return (
      <>
        <Box marginLeft="20px">
          <Typography variant="h5">Expenses by categories</Typography>
        </Box>
        <ChartWrapper>
          <Chart
            data={categories.map(category => ({
              name: category.name,
              value: category.amount * -1,
            }))}
          />
        </ChartWrapper>
        <List>
          {categories.map(category => (
            <List.Item key={category.id}>
              <List.ItemRow>
                {category.name}
                <Box marginLeft="auto">
                  <FormattedAmount>{category.amount}</FormattedAmount>
                </Box>
              </List.ItemRow>
            </List.Item>
          ))}
        </List>
      </>
    )
  }
}
