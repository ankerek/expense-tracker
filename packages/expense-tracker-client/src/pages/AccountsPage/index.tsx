import React from 'react'
import { GetAccountList } from '@modules/account/GetAccountList'
import { AccountList } from '@pages/AccountsPage/components/AccountList'
import { PageLayout } from '@core-components/PageLayout'

export class AccountsPage extends React.Component {
  render() {
    return (
      <PageLayout title="Accounts">
        <GetAccountList>
          {({ data, subscribe }) =>
            data && data.getAccountList ? (
              <AccountList
                accounts={data.getAccountList}
                subscribe={subscribe}
              />
            ) : null
          }
        </GetAccountList>
      </PageLayout>
    )
  }
}
