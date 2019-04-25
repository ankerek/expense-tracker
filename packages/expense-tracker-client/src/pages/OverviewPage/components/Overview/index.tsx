import React from 'react'
import gql from 'graphql-tag'
import {
  GetOverviewFilterQuery,
  GetTransactionListQuery_getTransactionList,
} from '@schema-types'
import { Query } from 'react-apollo'
import isWithinInterval from 'date-fns/isWithinInterval'
import { EmptyState } from '@components/EmptyState'
import { CategoriesExpenses } from '../CategoriesExpenses'
import { AccountsBalance } from '../AccountsBalance'
import { PeriodFilter } from '../PeriodFilter'
import { OverviewBoxes, OverviewBox } from './elements'

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
                {filteredTransactions.length ? (
                  <OverviewBoxes>
                    <OverviewBox>
                      <AccountsBalance transactions={filteredTransactions} />
                    </OverviewBox>
                    <OverviewBox>
                      <CategoriesExpenses
                        transactions={filteredTransactions.filter(
                          transaction => transaction.amount < 0
                        )}
                      />
                    </OverviewBox>
                  </OverviewBoxes>
                ) : (
                  <EmptyState title="There is no data in this period" />
                )}
              </>
            )
          }

          return null
        }}
      </Query>
    )
  }
}
