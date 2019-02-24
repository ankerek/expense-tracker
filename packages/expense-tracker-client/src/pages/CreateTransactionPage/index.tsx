import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateTransaction } from '@controllers/transaction/CreateTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/AccountList'

export class CreateTransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new transaction" hasGoBack>
        <GetAccountList>
          {({ data }) =>
            data && data.getAccountList ? (
              <CreateTransaction>
                {(submit, { loading }) => (
                  <TransactionForm
                    submit={submit}
                    accounts={data.getAccountList}
                    loading={loading}
                  />
                )}
              </CreateTransaction>
            ) : (
              <>Loading...</>
            )
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}
