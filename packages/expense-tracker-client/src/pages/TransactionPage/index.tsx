import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { GetTransaction } from '@controllers/transaction/GetTransaction'
import { UpdateTransaction } from '@controllers/transaction/UpdateTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/GetAccountList'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'

export class TransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Transaction" hasGoBack>
        <GetAccountList>
          {({ data }) =>
            data && data.getAccountList ? (
              <GetTransaction>
                {({ data: transactionData }) => {
                  const transaction =
                    transactionData && transactionData.getTransaction
                  return transaction ? (
                    <>
                      {!transaction.isPersisted && (
                        <ItemNotPersistedIndicator />
                      )}
                      <UpdateTransaction>
                        {(submit, { loading }) => (
                          <TransactionForm
                            initialValues={transactionData.getTransaction}
                            submit={submit}
                            accounts={data.getAccountList}
                            hasDelete
                            loading={loading}
                          />
                        )}
                      </UpdateTransaction>
                    </>
                  ) : null
                }}
              </GetTransaction>
            ) : null
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}
