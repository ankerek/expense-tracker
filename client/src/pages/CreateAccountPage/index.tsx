import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { CreateAccount } from './controllers/CreateAccount'
import { CreateAccountForm } from './components/CreateAccountForm'

export class CreateAccountPage extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="display1">Create new account</Typography>
        <CreateAccount>
          {({ submit }) => <CreateAccountForm submit={submit} />}
        </CreateAccount>
      </div>
    )
  }
}
