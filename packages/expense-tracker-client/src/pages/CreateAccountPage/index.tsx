import React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { SaveAccount } from '@modules/account/SaveAccount'
import { AccountForm } from '@core-components/AccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new account" hasGoBack>
        <SaveAccount>
          {(submit, { loading }) => (
            <AccountForm submit={submit} loading={loading} />
          )}
        </SaveAccount>
      </PageLayout>
    )
  }
}
