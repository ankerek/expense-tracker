import React from 'react'
import { GetTransactionList } from '@controllers/transaction/GetTransactionList'
import { TransactionList } from '@pages/TransactionsPage/components/TransactionList'
import { PageLayout } from '@core-components/PageLayout'

export class TransactionsPage extends React.Component {
  render() {
    return (
      <PageLayout title="Transactions">
        <GetTransactionList>
          {({ data }) =>
            data && data.getTransactionList ? (
              <TransactionList transactions={data.getTransactionList} />
            ) : null
          }
        </GetTransactionList>
      </PageLayout>
    )
  }
}
