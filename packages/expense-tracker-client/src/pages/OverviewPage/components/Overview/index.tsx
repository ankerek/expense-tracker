import React from 'react'
import gql from 'graphql-tag'
import {
  GetOverviewFilterQuery,
  GetTransactionListQuery_getTransactionList,
} from '@schema-types'
import isWithinInterval from 'date-fns/isWithinInterval'
import { CategoriesExpenses } from '@pages/OverviewPage/components/CategoriesExpenses'
import { PeriodFilter } from '../PeriodFilter'
import { Query } from 'react-apollo'

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
                <CategoriesExpenses transactions={filteredTransactions} />
              </>
            )
          }

          return null
        }}
      </Query>
    )
  }
}
