import * as React from 'react'
import { GetAccountList } from '@pages/AccountsPage/controllers/AccountList'
import { AccountList } from '@pages/AccountsPage/components/AccountList'
import { PageLayout } from '@core-components/PageLayout'

export class AccountsPage extends React.Component {
  render() {
    return (
      <PageLayout title="Accounts">
        <GetAccountList>
          {({ data }) =>
            data.getAccountList ? (
              <AccountList accounts={data.getAccountList} />
            ) : null
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}