import * as React from 'react'
import { CreateUser } from './controllers/CreateUser'
import Typography from '@material-ui/core/Typography'
import { SignUpForm } from "@pages/SignUpPage/components/SignUpForm";

export const SignUpPage = () => (
  <div>
    <Typography variant="display1">Sign up</Typography>
    <CreateUser>
      {({ submit }) => (
        <SignUpForm
          submit={submit}
        />
      )}
    </CreateUser>
  </div>
)
