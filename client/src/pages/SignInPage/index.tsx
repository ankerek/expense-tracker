import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { SignIn } from '@pages/SignInPage/controllers/SignIn'
import { SignInForm } from '@pages/SignInPage/components/SignInForm'

export class SignInPage extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="display1">Sign in</Typography>
        <SignIn>
          {({ submit }) => <SignInForm submit={submit} />}
        </SignIn>
      </div>
    )
  }
}
