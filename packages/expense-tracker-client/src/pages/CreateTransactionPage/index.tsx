import React from 'react'
import { createTransactionUpdater } from '@controllers/transaction/updaters'
import { PageLayout } from '@core-components/PageLayout'
import { SaveTransaction } from '@controllers/transaction/SaveTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/GetAccountList'

export class CreateTransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new transaction" hasGoBack>
        <GetAccountList>
          {({ data }) =>
            data && data.getAccountList ? (
              <SaveTransaction update={createTransactionUpdater}>
                {(submit, { loading }) => (
                  <TransactionForm
                    submit={submit}
                    accounts={data.getAccountList}
                    loading={loading}
                  />
                )}
              </SaveTransaction>
            ) : (
              <>Loading...</>
            )
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}
