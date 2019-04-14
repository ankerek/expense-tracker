import React from 'react'
import { importAllPages } from '@pages/importAllPages'
import { PageLayout } from '@components/PageLayout'
import { SignIn } from '@modules/user/SignIn'
import { SignInForm } from '@pages/SignInPage/components/SignInForm'

export default class SignInPage extends React.Component {
  // componentDidMount() {
  //   importAllPages()
  // }

  render() {
    return (
      <PageLayout title="Sign in">
        <SignIn>
          {(submit, { loading }) => (
            <SignInForm submit={submit} loading={loading} />
          )}
        </SignIn>
      </PageLayout>
    )
  }
}
