import React from 'react'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'
import isWithinInterval from 'date-fns/isWithinInterval'
import { CategoriesExpenses } from '@pages/OverviewPage/components/CategoriesExpenses'

const interval = {
  start: '2019-04-01',
  end: '2019-04-03',
}

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

    const filteredTransactions = transactions.filter(transaction =>
      isWithinInterval(transaction.createdAt, interval)
    )

    return (
      <>
        <CategoriesExpenses transactions={filteredTransactions} />
      </>
    )
  }
}
