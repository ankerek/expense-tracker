import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { SaveTransaction } from '@controllers/transaction/SaveTransaction'
import { TransactionForm } from '@core-components/TransactionForm'
import { GetAccountList } from '@controllers/account/GetAccountList'
import { GetCategoryList } from '@controllers/category/GetCategoryList'

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
