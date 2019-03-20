import React from 'react'
import { createAccountUpdater } from '@controllers/account/updaters'
import { PageLayout } from '@core-components/PageLayout'
import { SaveAccount } from '@controllers/account/SaveAccount'
import { AccountForm } from '@core-components/AccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new account" hasGoBack>
        <SaveAccount update={createAccountUpdater}>
          {(submit, { loading }) => (
            <AccountForm submit={submit} loading={loading} />
          )}
        </SaveAccount>
      </PageLayout>
    )
  }
}
