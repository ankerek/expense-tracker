import React from 'react'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'
import { TransactionList } from '@pages/TransactionsPage/components/TransactionList'
import { PageLayout } from '@components/PageLayout'

export default class TransactionsPage extends React.Component {
  render() {
    return (
      <PageLayout title="Transactions">
        <GetTransactionList>
          {({ data, subscribe }) =>
            data && data.getTransactionList ? (
              <TransactionList
                transactions={data.getTransactionList}
                subscribe={subscribe}
              />
            ) : null
          }
        </GetTransactionList>
      </PageLayout>
    )
  }
}
