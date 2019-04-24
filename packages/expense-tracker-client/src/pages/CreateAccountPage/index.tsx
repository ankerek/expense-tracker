import React from 'react'
import { PageLayout } from '@components/PageLayout'
import { SaveAccount } from '@modules/account/SaveAccount'
import { AccountForm } from '@components/AccountForm'

export default class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Add account" hasGoBack>
        <SaveAccount>
          {(submit, { loading }) => (
            <AccountForm submit={submit} loading={loading} />
          )}
        </SaveAccount>
      </PageLayout>
    )
  }
}
