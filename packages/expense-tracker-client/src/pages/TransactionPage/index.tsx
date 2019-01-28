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
          {({ data }) =>
            data && data.getAccountList ? (
              <GetTransaction>
                {({ data: transactionData }) =>
                  transactionData && transactionData.getTransaction ? (
                    <UpdateTransaction>
                      {({ submit }) => (
                        <TransactionForm
                          initialValues={transactionData.getTransaction}
                          submit={submit}
                          accounts={data.getAccountList}
                          hasDelete
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
