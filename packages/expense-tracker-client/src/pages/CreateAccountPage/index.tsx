import * as React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateAccount } from '@controllers/account/CreateAccount'
import { AccountForm } from '@core-components/AccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new account" hasGoBack>
        <CreateAccount>
          {({ submit }) => <AccountForm submit={submit} />}
        </CreateAccount>
      </PageLayout>
    )
  }
}
