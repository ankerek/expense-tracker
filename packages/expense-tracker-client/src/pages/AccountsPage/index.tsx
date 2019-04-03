import React from 'react'
import { GetAccountList } from '@modules/account/GetAccountList'
import { AccountList } from '@pages/AccountsPage/components/AccountList'
import { PageLayout } from '@core-components/PageLayout'
import { GetTransactionList } from '@modules/transaction/GetTransactionList'

export class AccountsPage extends React.Component {
  render() {
    return (
      <PageLayout title="Accounts">
        <GetAccountList>
          {({ data: accountListData, subscribe: subscribeAccounts }) => (
            <GetTransactionList>
              {({
                data: transactionListData,
                subscribe: subscribeTransactions,
              }) =>
                accountListData &&
                accountListData.getAccountList &&
                transactionListData &&
                transactionListData.getTransactionList ? (
                  <AccountList
                    accounts={accountListData.getAccountList}
                    transactions={transactionListData.getTransactionList}
                    subscribeAccounts={subscribeAccounts}
                    subscribeTransactions={subscribeTransactions}
                  />
                ) : null
              }
            </GetTransactionList>
          )}
        </GetAccountList>
      </PageLayout>
    )
  }
}
