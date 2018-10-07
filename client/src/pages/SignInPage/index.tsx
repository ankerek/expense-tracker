import * as React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { SignIn } from '@pages/SignInPage/controllers/SignIn'
import { SignInForm } from '@pages/SignInPage/components/SignInForm'

export class SignInPage extends React.Component {
  render() {
    return (
      <PageLayout title="Sign in">
        <SignIn>{({ submit }) => <SignInForm submit={submit} />}</SignIn>
      </PageLayout>
    )
  }
}
