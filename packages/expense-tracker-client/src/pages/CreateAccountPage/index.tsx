import * as React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateAccount } from './controllers/CreateAccount'
import { CreateAccountForm } from './components/CreateAccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <PageLayout title="Create new account">
        <CreateAccount>
          {({ submit }) => <CreateAccountForm submit={submit} />}
        </CreateAccount>
      </PageLayout>
    )
  }
}
