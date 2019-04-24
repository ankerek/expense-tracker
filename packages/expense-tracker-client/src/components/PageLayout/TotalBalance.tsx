import React from 'react'
import { FormattedAmount } from '@components/FormattedAmount'
import { TotalBalanceWrapper, TotalBalanceLabel } from './elements'
import { Overview } from '@pages/OverviewPage/components/Overview'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'
import { GetTransactionListQuery_getTransactionList } from '@schema-types'

interface TotalBalanceProps {
  transactions: GetTransactionListQuery_getTransactionList[]
  subscribe?: () => void
}

export class TotalBalance extends React.PureComponent<TotalBalanceProps> {
  componentDidMount() {
    if (this.props.subscribe) {
      this.props.subscribe()
    }
  }

  render() {
    const { transactions } = this.props
    const totalAmount = transactions.reduce((acc, curr) => {
      return (acc += curr.amount)
    }, 0)

    return (
      <GetTransactionList>
        {({ data }) =>
          data && data.getTransactionList ? (
            <TotalBalanceWrapper>
              <TotalBalanceLabel>Total balance:</TotalBalanceLabel>
              <FormattedAmount amount={totalAmount} color="#FFFFFF" />
            </TotalBalanceWrapper>
          ) : null
        }
      </GetTransactionList>
    )
  }
}
