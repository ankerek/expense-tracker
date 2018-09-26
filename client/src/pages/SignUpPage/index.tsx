import * as React from 'react'
import { CreateUserMutation } from './controllers/CreateUserMutation'
import Typography from '@material-ui/core/Typography'
import { SignUpForm } from "@pages/SignUpPage/components/SignUpForm";

export const SignUpPage = () => (
  <div>
    <Typography variant="display1">Registration</Typography>
    <CreateUserMutation>
      {createUser => (
        <SignUpForm
          createUser={createUser}
        />
      )}
    </CreateUserMutation>
  </div>
)
