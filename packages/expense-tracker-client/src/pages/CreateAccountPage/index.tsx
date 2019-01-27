import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateAccount } from '@controllers/account/CreateAccount'
import { AccountForm } from '@core-components/AccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new account" hasGoBack>
        <CreateAccount>
          {(submit, { loading }) => (
            <AccountForm submit={submit} loading={loading} />
          )}
        </CreateAccount>
      </PageLayout>
    )
  }
}
