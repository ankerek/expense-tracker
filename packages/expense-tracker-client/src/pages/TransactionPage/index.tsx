import React from 'react'
import { SaveTransaction } from '@controllers/transaction/SaveTransaction'
import { PageLayout } from '@core-components/PageLayout'
import { GetTransaction } from '@controllers/transaction/GetTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/GetAccountList'
import { ItemNotPersistedIndicator } from '@core-components/ItemNotPersistedIndicator'
import { GetCategoryList } from '@controllers/category/GetCategoryList'

export class TransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Transaction" hasGoBack>
        <GetAccountList>
          {({ data: accountListData }) => (
            <GetCategoryList>
              {({ data: categoryListData }) =>
                accountListData &&
                accountListData.getAccountList &&
                categoryListData &&
                categoryListData.getCategoryList ? (
                  <GetTransaction>
                    {({ data: transactionData }) => {
                      const transaction =
                        transactionData && transactionData.getTransaction
                      return transaction ? (
                        <>
                          {!transaction.isPersisted && (
                            <ItemNotPersistedIndicator />
                          )}
                          <SaveTransaction>
                            {(submit, { loading }) => (
                              <TransactionForm
                                initialValues={transactionData.getTransaction}
                                submit={submit}
                                accounts={accountListData.getAccountList}
                                categories={categoryListData.getCategoryList}
                                hasDelete
                                loading={loading}
                              />
                            )}
                          </SaveTransaction>
                        </>
                      ) : null
                    }}
                  </GetTransaction>
                ) : null
              }
            </GetCategoryList>
          )}
        </GetAccountList>
      </PageLayout>
    )
  }
}
