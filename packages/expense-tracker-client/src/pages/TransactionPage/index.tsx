import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { GetTransaction } from '@controllers/transaction/GetTransaction'
import { UpdateTransaction } from '@controllers/transaction/UpdateTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/AccountList'

export class TransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Transaction" hasGoBack>
        <GetAccountList>
          {({ data: { getAccountList } }) =>
            getAccountList ? (
              <GetTransaction>
                {({ data: { getTransaction } }) =>
                  getTransaction ? (
                    <UpdateTransaction>
                      {({ submit }) => (
                        <TransactionForm
                          initialValues={getTransaction}
                          submit={submit}
                          accounts={getAccountList}
                        />
                      )}
                    </UpdateTransaction>
                  ) : null
                }
              </GetTransaction>
            ) : null
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}
