import React from 'react'
import { SaveTransaction } from '@modules/transaction/SaveTransaction'
import { PageLayout } from '@components/PageLayout'
import { GetTransaction } from '@modules/transaction/GetTransaction'
import { TransactionForm } from '@components/TransactionForm'
import { GetAccountList } from '@modules/account/GetAccountList'
import { ItemNotPersistedIndicator } from '@components/ItemNotPersistedIndicator'
import { GetCategoryList } from '@modules/category/GetCategoryList'

export default class TransactionPage extends React.Component {
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
