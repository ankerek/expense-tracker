import * as React from 'react'
import { PageLayout } from '@core-components/PageLayout'
import { CreateUser } from './controllers/CreateUser'
import { SignUpForm } from './components/SignUpForm'

export const SignUpPage = () => (
  <PageLayout title="Sign up">
    <CreateUser>{({ submit }) => <SignUpForm submit={submit} />}</CreateUser>
  </PageLayout>
)
