import React from 'react'
import gql from 'graphql-tag'
import {
  GetOverviewFilterQuery,
  GetTransactionListQuery_getTransactionList,
} from '@schema-types'
import { Query } from 'react-apollo'
import isWithinInterval from 'date-fns/isWithinInterval'
import { CategoriesExpenses } from '../CategoriesExpenses'
import { AccountsExpenses } from '../AccountsExpenses'
import { PeriodFilter } from '../PeriodFilter'
import { ExpenseBoxes, ExpenseBox } from './elements'

const getOverviewFilterQuery = gql`
  query GetOverviewFilterQuery {
    overviewFilter @client {
      period {
        start
        end
      }
    }
  }
`

interface OverviewProps {
  transactions: GetTransactionListQuery_getTransactionList[]
  subscribe?: () => void
}

export class Overview extends React.Component<OverviewProps> {
  componentDidMount() {
    if (this.props.subscribe) {
      this.props.subscribe()
    }
  }

  render() {
    const { transactions } = this.props

    return (
      <Query<GetOverviewFilterQuery> query={getOverviewFilterQuery}>
        {({ data }) => {
          if (data && data.overviewFilter) {
            const filteredTransactions = transactions.filter(transaction =>
              isWithinInterval(
                transaction.createdAt,
                data.overviewFilter.period
              )
            )
            return (
              <>
                <PeriodFilter period={data.overviewFilter.period} />
                <ExpenseBoxes>
                  <ExpenseBox>
                    <AccountsExpenses transactions={filteredTransactions} />
                  </ExpenseBox>
                  <ExpenseBox>
                    <CategoriesExpenses transactions={filteredTransactions} />
                  </ExpenseBox>
                </ExpenseBoxes>
              </>
            )
          }

          return null
        }}
      </Query>
    )
  }
}
