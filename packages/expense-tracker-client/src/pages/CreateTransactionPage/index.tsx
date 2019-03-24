import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { SaveTransaction } from '@controllers/transaction/SaveTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/GetAccountList'
import { GetCategoryList } from '@controllers/category/GetCategoryList'
import { EmptyState } from '@core-components/EmptyState'

export class CreateTransactionPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new transaction" hasGoBack>
        <GetAccountList>
          {({ data: accountListData }) => (
            <GetCategoryList>
              {({ data: categoryListData }) =>
                accountListData &&
                accountListData.getAccountList &&
                categoryListData &&
                categoryListData.getCategoryList ? (
                  accountListData.getAccountList.length &&
                  categoryListData.getCategoryList.length ? (
                    <SaveTransaction>
                      {(submit, { loading }) => (
                        <TransactionForm
                          submit={submit}
                          accounts={accountListData.getAccountList}
                          categories={categoryListData.getCategoryList}
                          loading={loading}
                        />
                      )}
                    </SaveTransaction>
                  ) : (
                    <EmptyState title="You need at least one account and one category to create a new transaction" />
                  )
                ) : (
                  <>Loading...</>
                )
              }
            </GetCategoryList>
          )}
        </GetAccountList>
      </PageLayout>
    )
  }
}
